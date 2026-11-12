const crypto = require('crypto');
const { redis, who } = require('./_lib');

const fail = (res, code, error) => res.status(code).json({ error });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return fail(res, 405, 'Metoda niedozwolona');
  const { action, name } = req.body || {};

  if (action === 'me') {
    const me = await who(req);
    return me ? res.json(me) : fail(res, 401, 'Sesja wygasła');
  }
  if (action !== 'register') return fail(res, 400, 'Nieznana akcja');

  const n = String(name || '').trim();
  if (!n) return fail(res, 400, 'Podaj nazwę użytkownika!');
  if (n.length > 16) return fail(res, 400, 'Nazwa może mieć maks. 16 znaków.');

  const id = crypto.randomBytes(8).toString('hex');
  const ok = await redis.set('u:' + n.toLowerCase(), { id, name: n }, { nx: true });
  if (!ok) return fail(res, 409, 'Ta nazwa jest już zajęta!');
  await redis.hset('col:profiles', { [id]: { name: n } });

  const token = crypto.randomBytes(32).toString('hex');
  await redis.set('sess:' + token, { id, name: n });
  await redis.incr('ver');
  res.json({ token, id, name: n });
};
