const { redis, COLS, who } = require('./_lib');

const fail = (res, code, error) => res.status(code).json({ error });
const s = (v, n) => String(v == null ? '' : v).slice(0, n);

function clean(c, d, me, old) {
  d = d || {};
  if (c === 'videos') {
    if (!/^https:\/\/.{3,}/i.test(String(d.file || ''))) return null;
    const th = String(d.thumb || '');
    return { title: s(d.title, 100), desc: s(d.desc, 1000), cat: s(d.cat, 30), file: s(d.file, 500),
      thumb: th.startsWith('data:image/jpeg') && th.length < 40000 ? th : '',
      uid: me.id, ts: old ? old.ts : Date.now(), views: old ? old.views || 0 : 0 };
  }
  if (c === 'comments') return { vid: s(d.vid, 60), t: s(d.t, 1000), u: me.id, ts: old ? old.ts : Date.now() };
  if (c === 'likes') return { vid: s(d.vid, 60), u: me.id, v: 1 };
  if (c === 'subs') return { u: me.id, c: s(d.c, 64) };
  return null;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return fail(res, 405, 'Metoda niedozwolona');
  const { c, id, op, data } = req.body || {};
  if (!COLS.includes(c) || c === 'profiles' || !id || String(id).length > 100) return fail(res, 400, 'Zły request');
  const key = 'col:' + c, owner = c === 'videos' ? 'uid' : 'u';

  if (op === 'view') {
    if (c !== 'videos') return fail(res, 400, 'Zły request');
    const d = await redis.hget(key, id);
    if (d) { d.views = (d.views || 0) + 1; await redis.hset(key, { [id]: d }); }
    return res.json({ ok: 1 });
  }

  const me = await who(req);
  if (!me) return fail(res, 401, 'Zaloguj się.');
  const old = await redis.hget(key, id);
  if (old && old[owner] !== me.id) return fail(res, 403, 'To nie jest twoje.');

  if (op === 'delete') {
    if (old) { await redis.hdel(key, id); await redis.incr('ver'); }
    return res.json({ ok: 1 });
  }
  if (op === 'set' || op === 'update') {
    if (c === 'likes' && !String(id).endsWith('_' + me.id)) return fail(res, 403, 'Zły identyfikator.');
    if (c === 'subs' && !String(id).startsWith(me.id + '_')) return fail(res, 403, 'Zły identyfikator.');
    const d = clean(c, data, me, old);
    if (!d) return fail(res, 400, 'Niepoprawne dane (wideo wymaga linku https).');
    await redis.hset(key, { [id]: d });
    await redis.incr('ver');
    return res.json({ ok: 1 });
  }
  return fail(res, 400, 'Nieznana operacja');
};
