require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const map = new Map();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
app.post('/api/shorturl', function (req, res) {
  const url = req.body.url;
  console.log('url', url)

  if (!urlPattern.test(url)) {
    return res.json({
      error: 'invalid url',
    });
  }

  const mapLength = map.size;
  const key = `${mapLength + 1}`;
  map.set(key, url);

  res.json({
    original_url: url,
    short_url: parseInt(key),
  });
});

app.get('/api/shorturl/:key', function (req, res) {
  const key = req.params['key'];
  const targetUrl = map.get(key);

  res.redirect(targetUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
