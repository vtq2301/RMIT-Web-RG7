const { BSON } = require('bson');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const env = require('dotenv').config();
const bcrypt = require('bcrypt');

const passConstRegex = /^(?=.[A-Z])(?=.[a-z])(?=.\d)(?=.[!@#$%^&])[A-Za-z\d!@#$%^&]{8,20}$ /
// CONNECT TO MONGODB
mongoose.connect(process.env.MDB_CONNECT)
.then(() => console.log('Connected to MDB'))
.catch((error) => console.log(error.message));

// ALL USER SCHEMA
const userSchema = new mongoose.Schema({
  // USERNAME 
  username: {
    type: String,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9]{8,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid username`
    },
    require: [true, `Username required`]
  },
  // PASSWORD
  password: {
    type: String,
    validate: {
      validator: function(v) {
        return passConstRegex.text(v);
      },
      message: props => `${props.value} is not a valid password`
    },
    require: [true, `password required`]
  },

  // PROFILE PICTURE 
  profilePicture: {type: BSON, require: true}
});

// CUSTOMER USER SCHEMA 
const customerUserSchema = new mongoose.Schema({
  // NAME 
  name: {type: String, require: true, min: 5},
  // ADDRESS
  address: {type: String, require: true, min: 5}
});

// VENDOR USER SCHEMA 
const vendorUserSchema = new mongoose.Schema({
  businessName: {type: String, require: true, min: 5, unique: true},
  businessAddress: {type: String, require: true, min: 5, unique: true}
});

// SHIPPER USER SCHEMA
const shipperUserSchema = new mongoose.Schema({
  hubName: {
    type: String,
    enum: [`hub1`, `hub2`, `hub3`]
  },
  hubAddress: {
    type: String,
    enum: [`A1`, `A2`, `A3`]
  }
});

// Models of Users
const User = mongoose.model('User', userSchema);
const Vendor = mongoose.model('Vendor', vendorUserSchema);
const Shipper = mongoose.model('Shipper', shipperUserSchema);

// Parse data
app.use(express.urlencoded({ extended: true }));

// CREATE CUSTOMER

app.post('/register_customer', (req, res) => {
  const user = new User(req.body);
  
  })
})


