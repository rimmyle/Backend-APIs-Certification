require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const dns = require('dns');
const cors = require('cors');
const { resolve } = require('path');
const URL = require('url').URL;
const app = express();
let urls = []

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({entended: false}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  let input = new URL(req.body.url)
  dns.lookup(input.hostname, {all: true}, (err, address, family) => {
    if (err) {
      res.json({error: 'invalid url'})
    } else {
      if (!urls.includes(req.body.url)) {
        urls.push(req.body.url)
      }
      res.json({
        original_url: req.body.url,
        short_url: urls.indexOf(req.body.url)
      })
    }
  })
})

app.get('/api/shorturl/:shorturl', function(req, res) {
  res.redirect(urls[Number(req.params.shorturl)])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
