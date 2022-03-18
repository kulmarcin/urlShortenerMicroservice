const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let count = 0;

const urlArray = [];

app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const regex = /^(https*:\/\/)/;

  if (regex.test(url)) {
    urlArray.push({ short: ++count, original: url });
    res.json({ original_url: url, short_url: count });
  } else {
    res.json({ error: "invalid url, don't forget about http" });
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;

  const foundUrl = urlArray.find(el => el.short === +shortUrl);

  if (foundUrl) {
    res.redirect(foundUrl.original);
  } else {
    res.json({ error: 'url not found' });
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on port ${process.env.PORT || 3000}`);
});
