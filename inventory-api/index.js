const express = require('express');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const app = express();
app.use(express.json());

const DB = join(__dirname, 'data.json');
function load() { return JSON.parse(readFileSync(DB, 'utf8')); }
function save(data) { writeFileSync(DB, JSON.stringify(data, null, 2)); }

app.get('/items', (req, res) => res.json(load()));
app.post('/items', (req, res) => {
  const items = load();
  const item  = { id: Date.now().toString(), ...req.body };
  items.push(item); save(items);
  res.status(201).json(item);
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on port ${port}`));