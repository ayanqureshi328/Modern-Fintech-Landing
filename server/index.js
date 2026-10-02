import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = Number(process.env.PORT || 3001);
const mongoUri = process.env.MONGODB_URI;
let waitlist;

app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: waitlist ? 'ready' : 'database-unavailable' });
});

app.post('/api/waitlist', async (request, response) => {
  const email = typeof request.body?.email === 'string'
    ? request.body.email.trim().toLowerCase()
    : '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return response.status(400).json({ error: 'Enter a valid email address.' });
  }

  if (!waitlist) {
    return response.status(503).json({ error: 'Waitlist signups are temporarily unavailable.' });
  }

  try {
    const result = await waitlist.updateOne(
      { email },
      { $setOnInsert: { email, createdAt: new Date() } },
      { upsert: true },
    );

    return response.status(result.upsertedCount ? 201 : 200).json({
      message: result.upsertedCount ? 'You’re on the list.' : 'You’re already on the list.',
    });
  } catch (error) {
    console.error('Waitlist insert failed:', error);
    return response.status(500).json({ error: 'Could not save your signup. Please try again.' });
  }
});

async function start() {
  if (mongoUri) {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const database = client.db(process.env.MONGODB_DB || 'neobank');
    waitlist = database.collection('waitlist');
    await waitlist.createIndex({ email: 1 }, { unique: true });
    console.log(`Connected to MongoDB (${database.databaseName}.waitlist)`);
  } else {
    console.warn('MONGODB_URI is not set; waitlist submissions will return 503.');
  }

  app.listen(port, () => console.log(`NeoBank API listening on http://localhost:${port}`));
}

start().catch((error) => {
  console.error('Could not start NeoBank API:', error);
  process.exit(1);
});