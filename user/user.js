const { BSON } = require('bson');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const env = require('dotenv').config();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

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
  profilePicture: {type: BSON, require: true},
  // ROLE
  role: {type: String, enum: [`customer`, `vendor`, `shipper`]}
});

// CUSTOMER USER SCHEMA 
const customerUserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`
  },
  // NAME 
  name: {type: String, require: true, min: 5},
  // ADDRESS
  address: {type: String, require: true, min: 5}
});

// VENDOR USER SCHEMA 
const vendorUserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`
  },
  businessName: {type: String, require: true, min: 5, unique: true},
  businessAddress: {type: String, require: true, min: 5, unique: true}
});

// SHIPPER USER SCHEMA
const shipperUserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User`
  },
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
// parse incoming request bodies in JSON format.
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));


// REGISTER

// CREATE CUSTOMER
app.post('/register/customer', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      profilePicture: req.body.profilePicture,
      role: 'customer'
    });
    
    const customer = new Customer ({
      name: req.body.name,
      address: req.body.address
    });
    await User.save();
    res.status(201).send();

    await Customer.save();
    //the code res.status(201).send() sends a HTTP response with 
    // a status of 201 - Created to signify that a new resource has been successfully created on the server.
    res.status(201).send();
} catch {
  res.status(500).send();
}
});

// CREATE VENDOR
app.post('/register/vendor', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      profilePicture: req.body.profilePicture,
      role: 'vendor'
    });
    const vendor = new Vendor({
      businessName: req.body.businessName,
      businessAdress: req.body.businessAddress
    });

    await User.save();
    res.status(201).send();

    await Vendor.save();
    res.status(201).send();
} catch {
  res.status(500).send();
}
});

// CREATE SHIPPER 
app.post('/register/shipper', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      profilePicture: req.body.profilePicture,
      role: 'shipper'
    });
    const shipper = new Shipper({
      hubName: req.body.hubName,
      hubAddress: req.body.hubAddress
    });

    await User.save();
    res.status(201).send();

    await Shipper.save();
    res.status(201).send();
} catch {
  res.status(500).send();
}
});


// LOGIN

app.post('/login', async (req, res) => {
  const user = await User.findOne({username: req.body.username});
  const role = req.body.role
  // CHECK USERNAME
  if (!user) {
    return res.status(400).send('Username does not exist');
  }
  try {
    // CHECK PASSWORD
    if (await bcrypt.compare(req.body.password, User.password)) {
      // CHECK ROLES
      if (role === 'customer') {
        res.redirect('/index');
      } else if (role === 'vendor') {
        res.redirect('/vendor/index');
      } else { //shipper
        res.redirect('/shipper/index');
      };
    // SEND ERROR NOTI
    } else {
      res.send('Invalid username or password');
    }
  } catch {
    res.status(500).send();
  }
});