// Prosta baza w pamieci z zapisem do pliku, z tym samym interfejsem co klient Upstash Redis
const fs = require('fs');
const FILE = process.env.DATA_FILE || 'data.json';
let kv = {}, hs = {}, timer;

try { const d = JSON.parse(fs.readFileSync(FILE, 'utf8')); kv = d.kv || {}; hs = d.hs || {}; } catch (e) {}

const save = () => {
  clearTimeout(timer);
  timer = setTimeout(() => fs.writeFile(FILE, JSON.stringify({ kv, hs }), () => {}), 500);
};
const cl = x => (x == null ? null : JSON.parse(JSON.stringify(x)));

const db = {
  async get(k) { return cl(kv[k]); },
  async set(k, v, o) { if (o && o.nx && k in kv) return null; kv[k] = cl(v); save(); return 'OK'; },
  async incr(k) { kv[k] = (Number(kv[k]) || 0) + 1; save(); return kv[k]; },
  async hset(k, o) { hs[k] = Object.assign(hs[k] || {}, cl(o)); save(); return 1; },
  async hget(k, f) { return cl((hs[k] || {})[f]); },
  async hgetall(k) { return hs[k] ? cl(hs[k]) : null; },
  async hdel(k, f) { if (hs[k]) delete hs[k][f]; save(); return 1; },
  pipeline() {
    const q = [], p = {
      hgetall: k => (q.push(() => db.hgetall(k)), p),
      get: k => (q.push(() => db.get(k)), p),
      exec: () => Promise.all(q.map(f => f()))
    };
    return p;
  }
};
module.exports = db;
