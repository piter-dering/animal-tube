const { redis, COLS } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.query && req.query.v) return res.json({ v: Number(await redis.get('ver')) || 0 });
  const p = redis.pipeline();
  COLS.forEach(c => p.hgetall('col:' + c));
  p.get('ver');
  const r = await p.exec();
  const out = { v: Number(r[COLS.length]) || 0 };
  COLS.forEach((c, i) => { out[c] = Object.entries(r[i] || {}).map(([id, d]) => ({ id, ...d })); });
  res.json(out);
};
