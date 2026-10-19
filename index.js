require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

const app = express();

const DATA_FILE = path.join(__dirname, 'url-map.json');

// Load map from file if exists
function loadMap() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const obj = JSON.parse(data);
      return new Map(Object.entries(obj));
    } catch (e) {
      return new Map();
    }
  }
  return new Map();
}

// Save map to file
function saveMap(map) {
  const obj = Object.fromEntries(map.entries());
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj));
}

const map = loadMap();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function (req, res) {
  const url = req.body.url;

  let urlObj;
  try {
    if (typeof url !== 'string' || !url.trim()) throw new Error('Missing URL');
    urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol) || !urlObj.hostname) {
      throw new Error('Unsupported URL');
    }
  } catch (e) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(urlObj.hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const nextKey = Math.max(0, ...Array.from(map.keys(), Number).filter(Number.isFinite)) + 1;
    const key = String(nextKey);
    map.set(key, url);
    saveMap(map);

    res.json({
      original_url: url,
      short_url: parseInt(key),
    });
  });
});

app.get('/api/shorturl/:key', function (req, res) {
  const key = String(req.params['key']); // Ensure key is a string
  const targetUrl = map.get(key);

  if (!targetUrl) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  res.redirect(targetUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
