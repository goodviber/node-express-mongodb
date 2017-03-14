const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(express.static('public'))
app.use(bodyParser.json())

app.set('view engine', 'ejs');

MongoClient.connect('mongodb://maxmills:password@ds149489.mlab.com:49489/8ball', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res) {
  //var cursor = db.collection('quotes').find();
  db.collection('quotes').find().toArray(function(err, result) {
    if (err) return console.log(err)
        // renders index.ejs
        res.render('index.ejs', {quotes: result})
  })
})

app.post('/quotes', function(req, res) {
  db.collection('quotes').save(req.body, (err, result) => {
   if (err) return console.log(err)

   console.log('saved to database')
   res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  // Handle put request
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  // Handle delete event here
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.json('A darth vadar quote got deleted')
  })
})
