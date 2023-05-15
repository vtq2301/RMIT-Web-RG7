const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const ejs = require('ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);
app.set('view engine', 'ejs');

// MongoDB connection settings
const mongoURI = 'mongodb://localhost:27017';
const dbName = 'your_database_name';
const collectionName = 'orders';

app.get('/', (req, res) => {
  MongoClient.connect(mongoURI, (err, client) => {
    if (err) {
      console.error('Failed to connect to MongoDB:', err);
      res.sendStatus(500);
      return;
    }

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    let total_price = 0;
    let items = req.session.items || [];

    items = items.map((item) => {
      if (req.body.update) {
        item[5] = parseInt(req.body[item[0]]);
        item[6] = item[5] * parseInt(item[1]);

        if (item[5] === 0) {
          return null;
        }
      }
      total_price += item[6];
      return item;
    });

    items = items.filter(Boolean);
    req.session.items = items;
    req.session.total_price = total_price;

    collection.find().toArray((err, orders) => {
      if (err) {
        console.error('Failed to fetch orders:', err);
        res.sendStatus(500);
        return;
      }

      res.render('cart', { items, total_price, orders });

      client.close();
    });
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
