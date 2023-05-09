function reqListener() {
    console.log(this.responseText);
  }
  
  const req = new XMLHttpRequest();
  req.addEventListener("load", reqListener);
  req.open("GET", "http://www.example.org/example.txt");
  req.send();