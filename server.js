require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 4000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

mongoose.connect(process.env.URI);

let schema = new mongoose.Schema({ url: 'string' });
let Url = mongoose.model('Url', schema);

let resObject = {};

app.post('/api/shorturl/new', bodyParser.urlencoded({ extended: false }), (req, res) => {
  let original_url = req.body['url'];
  // let short_url = original_url;
  console.log(req.body);
  resObject['original_url']= original_url;

  // await Url.create({ url: 'test' }, (err, data) => {
  //   res.json({ created: true })
  // })
  res.json(resObject);
})

// TEST CASES TO PASS

// You should provide your own project, not the example URL.

// You can POST a URL to / api / shorturl and get a JSON response
//  with original_url and short_url properties.Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}

// When you visit / api / shorturl / <short_url>, you will be redirected to the original URL.

//   If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain 
//   {error: 'invalid url' }