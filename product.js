const fs = require('fs');
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  if(req.session.usertype == "shipper"){
    res.redirect("/admin/shipping");
  }
  else if(req.session.usertype == "vendor"){
    res.redirect("/admin/product");
  }

  const file = fs.readFileSync('admin/items.db', 'utf-8');
  const lines = file.split('\n');
  let new_item = true;

  lines.forEach((line) => {
    const array = line.split(';');
    if(array[0].trim() == req.session.clickedname){
      req.body.name = array[0].trim();
      req.body.price = array[1].trim();
      req.body.pimage = array[2].trim();
      req.body.description = array[3].trim();
      req.body.status = array[4].trim();
      new_item = false;
    }
  });

  if(req.query.buy){
    if (!req.session.loggedin || req.session.loggedin !== true){
      res.redirect("/login");
    }

    let i = 0;
    req.session.items.forEach((item) => {
      if(item[0] == req.body.name){
        new_item = false;
        req.session.items[i][5] += 1;
        req.session.items[i][6] = parseInt(req.session.items[i][1]) * req.session.items[i][5];
        res.redirect("/cart");
      }
      i++;
    });

    if(new_item){
      req.session.items.push([req.body.name, req.body.price, req.body.pimage, req.body.description, req.body.status, 1, req.body.price]);
      res.redirect("/cart");
    }
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
