require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 4000;
var jsonParser = bodyParser.json();
mongoose.connect(process.env.URI);
let schema = new mongoose.Schema({ 
  original_url: String,
  short_url: String,
  shrtID: String
});
let Url = mongoose.model('Url', schema);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => { res.sendFile(process.cwd() + '/views/index.html') });

app.post('/api/shorturl/', jsonParser, (req, res) => {
  let originalUrl = req.body['url'];
  let short_url = originalUrl + '22135';
  let newUrl = new Url({
    original_url: originalUrl
  });

  console.log(newUrl);
  res.json(newUrl);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// TEST CASES TO PASS

// You can POST a URL to / api / shorturl and get a JSON response
//  with original_url and short_url properties.Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}

// When you visit / api / shorturl / <short_url>, you will be redirected to the original URL.

//   If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain 
//   {error: 'invalid url' }