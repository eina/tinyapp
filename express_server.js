const express = require('express');
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const randomatic = require('randomatic');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

function generateRandomString() {
  return randomatic('aA0', 6);
}

// set view engine to ejs
// app.set('views', './');
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.send("Hello!");  
})

app.get("/urls", (req, res) => {
  res.render('urls_index', { 
    urls: urlDatabase
  });
})

app.get("/urls/new", (req, res) => {
  res.render('urls_new');
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars);
})

app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});