const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_NAME = 'my_database';

// Define the models
const vendorSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const customerSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const shipperSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const Vendor = mongoose.model('Vendor', vendorSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Shipper = mongoose.model('Shipper', shipperSchema);

// Connect to the database
mongoose.connect('mongodb://localhost/' + DB_NAME, { useNewUrlParser: true });

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/register/vendor', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const vendor = new Vendor({
      email: req.body.email,
      password: hashedPassword,
    });
    await vendor.save();
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post('/register/customer', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const customer = new Customer({
      email: req.body.email,
      password: hashedPassword,
    });
    await customer.save();
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post('/register/shipper', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.

        body.password, 10);
        const shipper = new Shipper({
          email: req.body.email,
          password: hashedPassword,
        });
        await shipper.save();
        res.status(201).send();
      } catch {
        res.status(500).send();
      }
    });
    
    app.post('/login/vendor', async (req, res) => {
      const vendor = await Vendor.findOne({ email: req.body.email });
      if (!vendor) {
        return res.status(400).send('Invalid email or password');
      }
      try {
        if (await bcrypt.compare(req.body.password, vendor.password)) {
          res.send('Logged in');
        } else {
          res.send('Invalid email or password');
        }
      } catch {
        res.status(500).send();
      }
    });
    
    app.post('/login/customer', async (req, res) => {
      const customer = await Customer.findOne({ email: req.body.email });
      if (!customer) {
        return res.status(400).send('Invalid email or password');
      }
      try {
        if (await bcrypt.compare(req.body.password, customer.password)) {
          res.send('Logged in');
        } else {
          res.send('Invalid email or password');
        }
      } catch {
        res.status(500).send();
      }
    });
    
    app.post('/login/shipper', async (req, res) => {
      const shipper = await Shipper.findOne({ email: req.body.email });
      if (!shipper) {
        return res.status(400).send('Invalid email or password');
      }
      try {
        if (await bcrypt.compare(req.body.password, shipper.password)) {
          res.send('Logged in');
        } else {
          res.send('Invalid email or password');
        }
      } catch {
        res.status(500).send();
      }
    });
    
    // Start the server
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));