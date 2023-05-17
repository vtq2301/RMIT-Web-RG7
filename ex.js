const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// MongoDB connection string and options
const mongoURI = 'mongodb://localhost:27017';
const dbName = 'your_database_name';

async function createUser() {
  try {
    const client = await MongoClient.connect(mongoURI);
    const db = client.db(dbName);
    const collection = db.collection('users');

    const newUser = {
      username: 'example_user',
      passwordHash: bcrypt.hashSync('example_password', 10),
      usertype: 'customer', // Set the user's role here
    };

    await collection.insertOne(newUser);
    client.close();

    console.log('User created successfully');
  } catch (err) {
    console.error(err);
  }
}

createUser();
