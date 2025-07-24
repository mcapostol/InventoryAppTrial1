const express = require('express');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const app = express();
app.use(express.json());

// Calea către fișierul JSON care ține datele
const DB = join(__dirname, 'data.json');

// Funcții helper pentru a citi și salva datele
function load() {
  return JSON.parse(readFileSync(DB, 'utf8'));
}

function save(data) {
  writeFileSync(DB, JSON.stringify(data, null, 2));
}

// End‑point-uri REST
app.get('/items', (req, res) => {
  res.json(load());
});

app.post('/items', (req, res) => {
  const items = load();
  const item  = { id: Date.now().toString(), ...req.body };
  items.push(item);
  save(items);
  res.status(201).json(item);
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Pornim serverul și păstrăm referința
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

// Exportăm serverul ca să-l putem închide din teste
module.exports = server;
