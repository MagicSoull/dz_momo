# Локальная проверка

Проверено на PostgreSQL 18, Express и Vite. Скриншоты: [главная страница](screenshots/anime-home.png), [карточки аниме](screenshots/anime-cards.png) и [Swagger UI](screenshots/swagger-ui.png). [api-products.json](api-products.json) содержит ответ `GET /api/products` из базы данных.

После прямого `INSERT` в PostgreSQL запрос `GET /api/products?search=Аниме%20из%20БД` вернул новую запись. После обновления страницы она появилась первой карточкой: [скриншот проверки](screenshots/anime-direct-db.png). Тестовая запись затем удалена; исходный каталог снова содержит 15 аниме.

Контейнерный запуск дополнительно проверяет [workflow](../.github/workflows/verify.yml) после публикации изменений: `docker compose up --build -d`, чтение 15 записей из API и прямой SQL `INSERT` в PostgreSQL. Он сохраняет список контейнеров и его скриншот как артефакт `compose-verification`.
