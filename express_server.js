const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const randomatic = require("randomatic");

const app = express();
const PORT = 8080; // default port 8080

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const generateRandomString = () => randomatic("aA0", 6);

const checkEmail = (email, objRef) => {
  for (const refId in objRef) {
    console.log("what is this", objRef[refId].email, email);
    return objRef[refId].email === email;
  }
  // return true;
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  // [generateRandomString()]: "https://eina.ca",
};

const users = {
  // test: {
  //   userId: "test",
  //   email: "test@test.com",
  //   password: "123456789",
  // },
};

// set view engine to ejs
// app.set('views', './');
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("urls_register", {});
});

app.get("/login", (req, res) => {
  res.render("urls_login", {});
});

app.get("/urls", (req, res) => {
  console.log("what are you", users[req.cookies.user_id]);
  res.render("urls_index", {
    urls: urlDatabase,
    user: users[req.cookies.user_id],
  });
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", { user: users[req.cookies.user_id] });
});

app.get("/urls/:shortURL", (req, res) => {
  if (req.params.shortURL && urlDatabase[req.params.shortURL]) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      user: users[req.cookies.user_id],
    };
    res.render("urls_show", templateVars);
  } else {
    res.render("urls_error");
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (req.params.shortURL && urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  } else {
    res.render("urls_error", { user: users[req.cookies.user_id] });
  }
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(400);
    res.send("Please fill out email and/or password");
  }

  if (checkEmail(email, users)) {
    res.status(400);
    res.send("Email already exists");
  }

  const userId = generateRandomString();
  users[userId] = { id: userId, email, password };
  res.cookie("user_id", userId);
  console.log("user obj", users);
  console.log("cookies???", req.cookies);
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  if (req.body.username) {
    let templateVars = {
      user: users[req.cookies.user_id],
      urls: urlDatabase,
    };
    // res.cookie("username", req.body.username);
    res.render("urls_index", templateVars);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`urls/${randomString}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  return res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const { newURL } = req.body;

  urlDatabase[shortURL] = newURL;
  return res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
