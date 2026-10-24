# большая часть кода это ии слоп так что сильно не судите. Про дз узнал за 30 мин до его конца. Так что проект чисто на побаловаться.

# momo. — каталог аниме

Учебный каталог по ТЗ: React + Vite, Node.js + Express, PostgreSQL и Docker Compose. В базе данных хранятся 15 аниме с названием, описанием, ссылкой на обложку, жанром и условной ценой. Интерфейс вдохновлён [референсом](https://ru.pinterest.com/pin/1086000897642605449/). Это каталог карточек; видеоплеер в задание не входит.

Репозиторий проекта: [github.com/MagicSoull/dz_momo](https://github.com/MagicSoull/dz_momo).

## Запуск через Docker Compose

1. Установите и запустите Docker Desktop (Windows/macOS) или Docker Engine с Compose (Linux). Проверьте, что команда `docker compose version` выполняется без ошибки.
2. Скачайте проект и перейдите в его корневую папку (ту, где находится `compose.yaml`):

```bash
git clone https://github.com/MagicSoull/dz_momo.git
cd dz_momo
```

Если проект уже скачан, достаточно открыть терминал в его корневой папке. Затем соберите и запустите сервисы:

```bash
docker compose up --build
```

После запуска откройте каталог в браузере: **http://localhost:8080**. Должны появиться 15 карточек аниме. Проверить ответ API можно по адресу **http://localhost:5000/api/products** или командой:

```bash
curl http://localhost:5000/api/products
```

Интерактивная документация Swagger UI доступна по адресу **http://localhost:8080/api/docs/**. В ней можно открыть метод, нажать **Try it out** и отправить запрос. JSON-схема OpenAPI: **http://localhost:8080/api/openapi.json**.

В другом окне терминала команда `docker compose ps` покажет три запущенных сервиса: `db`, `api` и `frontend`. Для остановки нажмите `Ctrl+C` в окне запуска и выполните `docker compose down`. Данные в базе при обычной остановке сохраняются.

При первом запуске PostgreSQL выполняет [`db/init.sql`](db/init.sql). Если проект ранее запускался с каталогом кроссовок, выполните `docker compose down -v` перед новым запуском: это удалит старую учебную базу и создаст новую с 15 аниме.

## Как связаны компоненты

React запрашивает JSON по `/api/products` и `/api/categories`. Nginx в контейнере `frontend` пересылает эти запросы контейнеру `api`. Express выполняет SQL-запросы к PostgreSQL в контейнере `db`. Карточки всегда строятся из ответа API; массив аниме в React не хранится.

Обложки не лежат в проекте: в поле `image` таблицы `products` хранится прямой HTTPS-адрес изображения. Браузер загружает его по этой ссылке. При добавлении аниме через форму или API можно вставить свою ссылку на обложку.

| Метод | Путь | Действие |
| --- | --- | --- |
| `GET` | `/api/products` | Получить все аниме |
| `GET` | `/api/products?search=Наруто&category=Приключения&sort=price_asc` | Поиск, фильтр, сортировка |
| `GET` | `/api/categories` | Получить жанры из базы |
| `POST` | `/api/products` | Добавить аниме |
| `DELETE` | `/api/products/:id` | Удалить аниме |
| `GET` | `/api/health` | Проверить API и подключение к базе |

Значения `sort`: `newest`, `price_asc`, `price_desc`, `title`. Пример добавления через API из PowerShell:

```powershell
$body = @{ title = 'Новое аниме'; description = 'Описание'; image = 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx130003-HTDmeL4RGeJ4.png'; price = 299; category = 'Фэнтези' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/products' -ContentType 'application/json' -Body $body
```

Пример прямого добавления в базу данных для проверки преподавателем:

```bash
docker compose exec db psql -U catalog -d catalog -c "INSERT INTO products (title, description, image, price, category) VALUES ('Аниме из БД', 'Добавлено напрямую в PostgreSQL', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx130003-HTDmeL4RGeJ4.png', 199.00, 'Музыка');"
```

После обновления страницы новая карточка появится в каталоге. Это же можно увидеть в ответе `GET /api/products`.

## Локальная разработка

Для запуска без Docker нужна PostgreSQL с таблицей и данными из `db/init.sql`. В `server` выполните `npm ci`, задайте `DATABASE_URL` и запустите `npm start`. В `my-app` выполните `npm ci` и `npm run dev`, затем откройте `http://localhost:5173`. Swagger UI доступен по адресу `http://localhost:5173/api/docs/`. Vite проксирует `/api` на `http://localhost:5000`. Сборка клиента: `npm run build` в `my-app`.

## Материалы проверки

[Скриншот главной](docs/screenshots/anime-home.png), [скриншот карточек](docs/screenshots/anime-cards.png), [скриншот Swagger UI](docs/screenshots/swagger-ui.png), [скриншот прямого добавления в БД](docs/screenshots/anime-direct-db.png), [JSON-ответ API](docs/api-products.json) и [результаты проверки](docs/verification.md). После публикации изменений workflow [Verify Docker Compose app](.github/workflows/verify.yml) проверит запуск контейнеров и сохранит скриншот `docker compose ps` как артефакт GitHub Actions.
