CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    category VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Учебные цены; обложки загружаются по HTTPS-ссылкам AniList.
INSERT INTO products (title, description, image, price, category) VALUES
    ('Атака титанов', 'Люди за стенами борются за выживание и правду о своём мире.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buvcRTBx4NSm.jpg', 349.00, 'Экшен'),
    ('Клинок, рассекающий демонов', 'Тандзиро вступает в отряд охотников, чтобы спасти сестру.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg', 299.00, 'Экшен'),
    ('Магическая битва', 'Юдзи оказывается в мире проклятий и магических поединков.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg', 329.00, 'Экшен'),
    ('Тетрадь смерти', 'Загадочная тетрадь превращает школьника в опасного судью.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-kUgkcrfOrkUM.jpg', 249.00, 'Триллер'),
    ('Ван-Пис', 'Луффи и его команда ищут легендарное сокровище в открытом море.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-ELSYx3yMPcKM.jpg', 299.00, 'Приключения'),
    ('Наруто', 'Юный ниндзя мечтает стать сильнейшим защитником своей деревни.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-dE6UHbFFg1A5.jpg', 249.00, 'Приключения'),
    ('Человек-бензопила', 'Дэндзи заключает сделку с демоном и меняет свою судьбу.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-DdP4vAdssLoz.png', 329.00, 'Экшен'),
    ('Поднятие уровня в одиночку', 'Слабейший охотник получает шанс стать сильнейшим.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png', 349.00, 'Фэнтези'),
    ('Провожающая в последний путь Фрирен', 'Эльфийка отправляется в путешествие после победы над злом.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-qQTzQnEJJ3oB.jpg', 299.00, 'Фэнтези'),
    ('Семья шпиона', 'Шпион, убийца и телепат создают необычную семью.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx140960-Kb6R5nYQfjmP.jpg', 269.00, 'Комедия'),
    ('Звёздное дитя', 'За блеском сцены скрываются тайны индустрии развлечений.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx150672-WqmmwZ4nMzAy.png', 299.00, 'Драма'),
    ('Боччи-рок!', 'Застенчивая гитаристка находит друзей и свою сцену.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx130003-HTDmeL4RGeJ4.png', 229.00, 'Музыка'),
    ('Синяя тюрьма', 'Юные футболисты борются за право стать лучшим нападающим.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx137822-U8naszP96vzC.png', 269.00, 'Спорт'),
    ('Дандадан', 'Оккультные тайны и пришельцы сталкивают двух школьников.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx171018-60q1B6GK2Ghb.jpg', 329.00, 'Мистика'),
    ('Кайдзю № 8', 'Кафка вступает в отряд защиты, скрывая невероятный секрет.', 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx153288-25FBfFJzEQ5O.jpg', 299.00, 'Фантастика');
