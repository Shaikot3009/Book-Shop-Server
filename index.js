const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;

const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5056

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifp7e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connect error',err);
  const booksCollection = client.db("shop").collection("books");
  

  app.get('/books', (req, res) => {
      booksCollection.find()
      .toArray((error, items) => {
        res.send(items)
      })
  })

  app.get('/book/:id', (req, res) => {
    booksCollection.find({_id: ObjectId(req.params.id)})
    .toArray((error, items) => {
      res.send(items)
    })
})

  app.post('/Admin', (req, res) => {
      const newBook = req.body;
      console.log('adding new event: ', newBook)
      booksCollection.insertOne(newBook)
      .then(result => {
          console.log( 'inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })

//   client.close();
});


app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})