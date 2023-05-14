const ejs = require('ejs');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let title = 'Home';
  let message = '';
  res.render('welcome', { title, message });
}
);

function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML =  h + ":" + m + ":" + s;
    setTimeout(startTime, 1000);
  }
  
  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

  "But"