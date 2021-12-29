require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
var validUrl = require('valid-url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 4000;
var jsonParser = bodyParser.json();
mongoose.connect(process.env.URI);
let schema = new mongoose.Schema({ 
  original_url: String,
  short_url: String,
  trailing_id: String
});
let Url = mongoose.model('Url', schema);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => { res.sendFile(process.cwd() + '/views/index.html') });

app.post('/api/shorturl/', jsonParser, (req, res) => {
  if (validUrl.isUri(req.body['url'])){
    let originalUrl = req.body['url'];
    let trailingID = shortid.generate();
    let shortUrl = __dirname + '/api/shorturl/' + trailingID;
    let newUrl = new Url({
      original_url: originalUrl,
      short_url: shortUrl,
      trailing_id: trailingID
    });

    newUrl.save((err, doc) => {
      if (err) console.log(err);
      res.json(newUrl);
    });
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:trailing_id', (req, res) => {
  let generatedID = req.params.trailing_id;
  Url.find({trailing_id: generatedID}).then((foundURL)=>{
    let urlForRedir = foundURL[0];
    console.log(urlForRedir);
    res.redirect(urlForRedir.original_url);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// TEST CASES TO PASS

//   If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain 
//   {error: 'invalid url' }