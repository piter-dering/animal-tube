// Baza: Upstash Redis, jesli ustawiono zmienne srodowiskowe, w przeciwnym razie plik data.json
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let redis;
if (url && token) {
  const { Redis } = require('@upstash/redis');
  redis = new Redis({ url, token });
  console.log('Baza: Upstash Redis');
} else {
  redis = require('./_mem');
  console.log('UWAGA: brak Upstash, dane w pliku data.json (na Render Free znikaja po uspieniu lub restarcie).');
}

const COLS = ['videos', 'likes', 'subs', 'comments', 'profiles'];

async function who(req) {
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!t) return null;
  return (await redis.get('sess:' + t)) || null;
}

module.exports = { redis, COLS, who };
