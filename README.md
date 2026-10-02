# NeoBank

A responsive NeoBank landing page built with React, Vite, and Framer Motion. The waitlist API stores normalized email addresses in MongoDB and prevents duplicate signups.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to a local MongoDB instance or MongoDB Atlas connection string.
3. Start the frontend and API with `npm run dev`.
4. Open `http://localhost:5173`.

The API listens on port `3001` by default. Vite proxies `/api` requests to it. Without a MongoDB connection, the page still runs, but waitlist submissions return a clear unavailable message.

## API

- `GET /api/health` reports whether MongoDB is connected.
- `POST /api/waitlist` accepts `{ "email": "name@example.com" }`, validates and lowercases the address, then inserts it into the `waitlist` collection. A unique index prevents duplicate records.

Set `MONGODB_DB` or `PORT` in `.env` to override their defaults (`neobank` and `3001`). Run `npm run build` to create the static frontend in `dist/`.