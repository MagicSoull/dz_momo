# Большая часть кода это ии слоп так что сильно не судите. Про дз узнал за 30 мин до его конца. Так что проект чисто на побаловаться.

# momo. — каталог аниме

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


## Локальная разработка

Для запуска без Docker нужна PostgreSQL с таблицей и данными из `db/init.sql`. В `server` выполните `npm ci`, задайте `DATABASE_URL` и запустите `npm start`. В `my-app` выполните `npm ci` и `npm run dev`, затем откройте `http://localhost:5173`. Swagger UI доступен по адресу `http://localhost:5173/api/docs/`. Vite проксирует `/api` на `http://localhost:5000`. Сборка клиента: `npm run build` в `my-app`.
