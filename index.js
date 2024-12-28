import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'node:dns';
import url from 'node:url';
import { json } from 'node:stream/consumers';
const app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

// parse application/json
app.use(express.json());



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', async function(req, res) {
  let responseJSON;
  const inputURL = req.body.url;
  let URL = await ShortURL.findOne({ original_url: inputURL });
  if (URL === null) {
    let maxID = await ShortURL.find({}, { short_url: 1 , _id: 0}).sort({ short_url: -1 }).limit(1);
    if (maxID[0] === undefined) {
      maxID = 0;
    } else {
      maxID = maxID[0].short_url;
    }
    let newURL = new ShortURL({short_url: maxID + 1, original_url: inputURL});
    newURL.save();
    responseJSON = { original_url: inputURL, short_url: maxID + 1 };
  } else {
    responseJSON = { original_url: URL.original_url, short_url: URL.short_url };
  }
  res.json(responseJSON);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// mongoose
mongoose.connect(process.env.MONGO_URI);

const urlSchema = new mongoose.Schema({
  short_url: {
    type: Number
  },
  original_url: {
    type: String
  }
});

const ShortURL = mongoose.model("ShortURL", urlSchema);

