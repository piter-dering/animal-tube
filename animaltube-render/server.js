const express = require('express');
const path = require('path');

const app = express();
app.use(express.json({ limit: '100kb' }));

for (const name of ['auth', 'data', 'doc']) {
  const handler = require('./api/' + name);
  app.all('/api/' + name, (req, res, next) => handler(req, res).catch(next));
}
app.use('/api', (req, res) => res.status(404).json({ error: 'Nie ma takiej ścieżki' }));

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Błąd serwera' }); });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('AnimalTube dziala na porcie ' + port));
