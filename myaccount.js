const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const { MongoClient } = require('mongodb');

app.use(express.static(path.join(__dirname, 'avtimg')));
app.use(express.urlencoded({ extended: true }));

// Multer configuration for handling avatar file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'avtimg'));
  },
  filename: (req, file, cb) => {
    const username = req.session.username;
    cb(null, `${username}avt.png`);
  },
});
const upload = multer({ storage });

// MongoDB configuration
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'your_database_name';
const collectionName = 'accounts';

app.post('/profile', upload.single('new_avt'), async (req, res) => {
  try {
    const username = req.session.username;
    const avatar = req.file ? req.file.filename : null;
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Update user profile
    await collection.updateOne(
      { username },
      { $set: { avatar } }
    );

    client.close();
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/profile', async (req, res) => {
  try {
    const username = req.session.username;
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Retrieve user profile
    const user = await collection.findOne({ username });

    client.close();

    if (!user) {
      // User not found
      res.redirect('/login');
      return;
    }

    // Render the profile page based on user's role
    switch (user.usertype) {
      case 'customer':
        res.render('customer-profile', { user });
        break;
      case 'vendor':
        res.render('vendor-profile', { user });
        break;
      case 'shipper':
        res.render('shipper-profile', { user });
        break;
      default:
        res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});