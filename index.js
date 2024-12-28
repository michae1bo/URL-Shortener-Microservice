import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
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
app.post('/api/shorturl', function(req, res) {
  const URL = req.body.url;
  console.log(URL);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// mongoose
mongoose.connect(process.env.MONGO_URI);

const urlSchema = new mongoose.Schema({
  _id: {
    type: Number
  },
  url: {
    type: String
  }
});

const ShortURL = mongoose.model("ShortURL", urlSchema);

const findMaxId = ShortURL.find({}, { _id: 1 }).sort({ _id: -1 });

const maxID = await findMaxId.exec()[0];
console.log(maxID);

