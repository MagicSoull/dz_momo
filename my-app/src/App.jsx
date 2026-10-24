import { useEffect, useState } from 'react';
import './App.css';

const emptyForm = { title: '', description: '', image: '', price: '', category: '' };
const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

async function request(url, options) {
  const response = await fetch(url, options);
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Не удалось выполнить запрос');
  return data;
}

function AnimeCard({ anime, onDelete }) {
  return (
    <article className="anime-card">
      <div className="poster-wrap">
        <img src={anime.image} alt={`Обложка: ${anime.title}`} loading="lazy" />
        <span className="genre-pill">{anime.category}</span>
      </div>
      <div className="card-body">
        <h3>{anime.title}</h3>
        <p>{anime.description}</p>
        <div className="card-bottom">
          <span className="price">{money.format(anime.price)}</span>
          <button type="button" className="delete-button" onClick={() => onDelete(anime)} aria-label={`Удалить ${anime.title}`} title="Удалить аниме">×</button>
        </div>
      </div>
    </article>
  );
}

function AddAnimeDialog({ onClose, onAdded }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await request('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-heading">
          <div><span className="eyebrow">НОВОЕ АНИМЕ</span><h2 id="dialog-title">Добавить в каталог</h2></div>
          <button type="button" className="close-button" onClick={onClose} aria-label="Закрыть">×</button>
        </div>
        <form onSubmit={submit}>
          <label>Название<input name="title" value={form.title} onChange={update} required maxLength="120" placeholder="Название аниме" /></label>
          <label>Описание<textarea name="description" value={form.description} onChange={update} required rows="3" placeholder="Кратко о сюжете" /></label>
          <div className="form-row">
            <label>Жанр<input name="category" value={form.category} onChange={update} required maxLength="80" placeholder="Например, фэнтези" /></label>
            <label>Цена, ₽<input name="price" value={form.price} onChange={update} required type="number" min="0.01" step="0.01" placeholder="299" /></label>
          </div>
          <label>Ссылка на обложку<input name="image" value={form.image} onChange={update} required type="url" placeholder="https://example.com/cover.jpg" /><small>Вставьте прямую ссылку на изображение. Загружать файл не нужно.</small></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="primary-button full-width" disabled={saving}>{saving ? 'Добавляем…' : 'Добавить аниме'} <span aria-hidden="true">↗</span></button>
        </form>
      </section>
    </div>
  );
}

export default function App() {
  const [anime, setAnime] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ sort });
    if (search.trim()) params.set('search', search.trim());
    if (category) params.set('category', category);
    setLoading(true);
    setError('');
    Promise.all([
      request(`/api/products?${params}`, { signal: controller.signal }),
      request('/api/categories', { signal: controller.signal }),
    ]).then(([items, genres]) => {
      setAnime(items);
      setCategories(genres);
      setFeatured((current) => current || items.find((item) => item.title === 'Боччи-рок!') || items[0] || null);
    }).catch((err) => {
      if (err.name !== 'AbortError') setError(err.message);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [search, category, sort, revision]);

  async function removeAnime(item) {
    if (!window.confirm(`Удалить «${item.title}» из каталога?`)) return;
    try {
      await request(`/api/products/${item.id}`, { method: 'DELETE' });
      setFeatured((current) => current?.id === item.id ? null : current);
      setRevision((current) => current + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top"><span className="brand-flower">✳</span>momo<span className="brand-dot">.</span></a>
          <nav aria-label="Главная навигация"><a href="#top">Главная</a><a href="#catalog">Каталог</a></nav>
          <button className="header-add" type="button" onClick={() => setDialogOpen(true)}>+ Добавить аниме</button>
        </div>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-copy">
            <span className="hero-kicker"><span className="sparkle">✳</span> ТВОЙ АНИМЕ-КАТАЛОГ</span>
            <h1>Истории, в которые<br /><em>хочется вернуться.</em></h1>
            <p>Открой новое аниме для вечера: приключения, музыка, фэнтези и истории, которые останутся с тобой.</p>
            <a href="#catalog" className="hero-link">Открыть каталог <span aria-hidden="true">↗</span></a>
            <div className="hero-dots" aria-hidden="true"><b /><i /><i /></div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-ring" />
            {featured && <img src={featured.image} alt="" />}
            <span className="hero-star star-one">✦</span><span className="hero-star star-two">✳</span>
            <span className="hero-sticker">ТВОЯ НОВАЯ<br />ИСТОРИЯ</span>
          </div>
        </section>

        <section className="catalog-section container" id="catalog">
          <div className="section-heading">
            <div><span className="eyebrow">ВЫБИРАЙ ПОД НАСТРОЕНИЕ</span><h2>Каталог <em>аниме</em></h2></div>
            <p>Любимые истории и новые открытия<br />в одном месте.</p>
          </div>
          <div className="toolbar">
            <label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Найти аниме по названию или описанию" aria-label="Поиск аниме" /></label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Фильтр по жанру"><option value="">Все жанры</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Сортировка"><option value="newest">Сначала новые</option><option value="price_asc">Сначала дешевле</option><option value="price_desc">Сначала дороже</option><option value="title">По названию</option></select>
          </div>
          <div className="result-count">НАЙДЕНО: <strong>{anime.length}</strong></div>
          {error && <div className="notice error-notice" role="alert">{error} <button type="button" onClick={() => setRevision((current) => current + 1)}>Повторить</button></div>}
          {loading ? <div className="notice">Загружаем каталог…</div> : !error && anime.length === 0 ? <div className="notice">Ничего не найдено. Попробуйте другой запрос или жанр.</div> : <div className="anime-grid">{anime.map((item) => <AnimeCard key={item.id} anime={item} onDelete={removeAnime} />)}</div>}
        </section>
      </main>
      <footer className="site-footer"><div className="container footer-inner"><span className="brand"><span className="brand-flower">✳</span>momo<span className="brand-dot">.</span></span><span>Каталог аниме · учебный проект</span><a href="#top">Наверх ↑</a></div></footer>
      {dialogOpen && <AddAnimeDialog onClose={() => setDialogOpen(false)} onAdded={() => { setDialogOpen(false); setCategory(''); setSearch(''); setSort('newest'); setRevision((current) => current + 1); }} />}
    </div>
  );
}
