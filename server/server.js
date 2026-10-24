const express = require('express');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');

const app = express();
const port = Number(process.env.PORT) || 5000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json({ limit: '20kb' }));
app.get('/api/openapi.json', (_req, res) => res.json(openapi));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));

const columns = 'id, title, description, image, price, category, created_at';
const asProduct = (row) => ({ ...row, id: Number(row.id), price: Number(row.price) });
const sorts = {
  newest: 'created_at DESC, id DESC',
  price_asc: 'price ASC, id ASC',
  price_desc: 'price DESC, id DESC',
  title: 'title ASC, id ASC',
};

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();
    const sort = String(req.query.sort || 'newest');
    if (!sorts[sort]) return res.status(400).json({ error: 'Недопустимый порядок сортировки' });

    const values = [];
    const filters = [];
    if (search) {
      values.push(`%${search}%`);
      filters.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }
    if (category) {
      values.push(category);
      filters.push(`category = $${values.length}`);
    }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT ${columns} FROM products ${where} ORDER BY ${sorts[sort]}`,
      values
    );
    res.json(result.rows.map(asProduct));
  } catch (error) {
    next(error);
  }
});

app.get('/api/categories', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM products ORDER BY category');
    res.json(result.rows.map((row) => row.category));
  } catch (error) {
    next(error);
  }
});

app.post('/api/products', async (req, res, next) => {
  try {
    const { title, description, image, category, price } = req.body || {};
    const data = [title, description, image, category].map((value) =>
      typeof value === 'string' ? value.trim() : ''
    );
    const numericPrice = Number(price);
    if (data.some((value) => !value) || !Number.isFinite(numericPrice) ||
        numericPrice <= 0 || numericPrice > 99999999.99 ||
        Math.abs(Math.round(numericPrice * 100) - numericPrice * 100) > 0.000001 ||
        data[0].length > 120 || data[1].length > 2000 || data[2].length > 2000 || data[3].length > 80) {
      return res.status(400).json({ error: 'Заполните все поля и укажите цену больше нуля с точностью до копеек' });
    }
    if (!/^https?:\/\//i.test(data[2])) {
      return res.status(400).json({ error: 'Укажите ссылку на изображение с http:// или https://' });
    }
    const result = await pool.query(
      `INSERT INTO products (title, description, image, category, price)
       VALUES ($1, $2, $3, $4, $5) RETURNING ${columns}`,
      [data[0], data[1], data[2], data[3], numericPrice]
    );
    res.status(201).json(asProduct(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/products/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Некорректный ID товара' });
    }
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Товар не найден' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Ошибка сервера. Попробуйте позже.' });
});

app.listen(port, '0.0.0.0', () => console.log(`API listening on port ${port}`));
