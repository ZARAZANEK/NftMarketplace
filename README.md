 NFT Marketplace
Повноцінний fullstack застосунок для створення та перегляду продуктів з підтримкою різних валют (у тому числі криптовалют). Фронтенд побудований на Next.js + TypeScript + TailwindCSS, бекенд — Node.js + Express + MongoDB (Mongoose). Підтримується завантаження зображень у Cloudinary, авторизація через JWT, кошик з конвертацією валют у USD (через API).

 Функціонал
 Авторизація користувачів (JWT)

 Створення продуктів з фото, описом, категорією, ключовими словами

 Підтримка багатьох валют (USD, EUR, UAH, BTC, ETH, SOL тощо)

 Автоматична конвертація у USD для підрахунку підсумків

 Кошик з підрахунком subtotal, shipping, total

 Промокоди (наприклад, SAVE10)

 Темна/світла тема

 Завантаження зображень у Cloudinary

 Структура проєкту
Код
.
├── backend/              # Серверна частина (Express + MongoDB)
│   ├── src/
│   │   ├── models/       # Mongoose моделі (User, Product)
│   │   ├── controllers/  # Контролери (auth, products)
│   │   ├── routes/       # Express маршрути
│   │   ├── middleware/   # authMiddleware, errorHandler
│   │   └── config/       # Cloudinary, DB
│   └── app.js
│
├── frontend/             # Клієнтська частина (Next.js)
│   ├── app/              # Сторінки Next.js
│   ├── components/       # Компоненти (Header, Footer, ProductCard, Cart)
│   ├── context/          # CartContext, SearchContext
│   └── styles/           # Tailwind
│
└── README.md
 Встановлення та запуск
1. Клонування репозиторію
bash
git clone https://github.com/your-username/nft-marketplace.git
cd nft-marketplace
2. Налаштування бекенду
bash
cd backend
npm install
Створи файл .env у папці backend:

env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nft-marketplace
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Запуск сервера:

bash
npm run dev
3. Налаштування фронтенду
bash
cd ../frontend
npm install
Створи .env.local у папці frontend:

env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Запуск клієнта:

bash
npm run dev
Фронтенд буде доступний на http://localhost:3000.

 API для валют
Fiat: open.er-api.com

Crypto: CoinGecko API

 Використані технології
Frontend: Next.js, React, TypeScript, TailwindCSS, next-themes

Backend: Node.js, Express, MongoDB, Mongoose

Auth: JWT

Storage: Cloudinary

APIs: ExchangeRate API, CoinGecko API

121 Ліцензія
MIT License © 2025
