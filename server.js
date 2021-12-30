require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlparser = require('url');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
const app = express();

// Basic Configuration
var jsonParser = bodyParser.json();
const port = process.env.PORT || 4000;
mongoose.connect(process.env.URI);

let schema = new mongoose.Schema({ 
  original_url: String,
  short_url: String,
  trailing_id: String
});

let Url = mongoose.model('Url', schema);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));    deprecated

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => { res.sendFile(process.cwd() + '/views/index.html') });

app.post('/api/shorturl/', jsonParser, (req, res) => {
  let originalUrl = req.body.url;
  let trailingID = shortid.generate();
  let shortUrl = 'https://api/shorturl/' + trailingID;

  dns.lookup(urlparser.parse(originalUrl).hostname, (error, address)=>{
    console.log(address);
    if(!address){
      res.json({ error: 'invalid url' });
    } else {
      let newUrl = new Url({
        original_url: originalUrl,
        short_url: shortUrl,
        trailing_id: trailingID
      });
      console.log(newUrl);
      newUrl.save((err, data) => {
        if (err) console.log(err);
        res.json({
          original_url: data.original_url,
          short_url: data.short_url
        });
      });
    }
  });
});

app.get('/api/shorturl/:trailing_id',  (req, res) => {
  let reqURL = req.params.original_url;
  let reqID = req.params.trailing_id;
  Url.find({ short_url: req.params.short_url }, (err, data)=>{
    if(err) console.log(err);
    if(!data){
      res.json({ error: 'invalid url' });
    } else {
      return res.redirect(302, data[0].original_url)
    }
  })
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// TEST CASES TO PASS

//  When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.