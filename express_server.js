const express = require("express");
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const randomatic = require("randomatic");

const { urlDatabase, users } = require("./data");
const { getUserByEmail, urlsForUser } = require("./helper");

const app = express();
const PORT = 8080; // default port 8080

app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));

const generateRandomString = () => randomatic("aA0", 6);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  res.render("urls_register", {});
});

app.get("/login", (req, res) => {
  res.render("urls_login", {});
});

app.get("/urls", (req, res) => {
  const { user_id: sessionUserID } = req.session;
  if (urlsForUser(sessionUserID, urlDatabase)) {
    const templateVars = {
      urls: urlsForUser(sessionUserID),
      user: users[sessionUserID],
    };
    res.render("urls_index", templateVars);
  } else {
    res.render("urls_index", { urls: {}, user: "" });
  }
});

app.get("/urls/new", (req, res) => {
  if (users[req.session.user_id]) {
    res.render("urls_new", { user: users[req.session.user_id] });
  } else {
    res.redirect("/login");
  }
});

app.get("/u/:shortURL", (req, res) => {
  console.log("hello", urlDatabase[req.params.shortURL]);
  if (req.params.shortURL && urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.render("urls_error", { user: users[req.session.user_id] });
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  // check if user logged in has URLS
  const userURLs = urlsForUser(req.session.user_id);
  // if the shortURL exists in that object
  if (userURLs && shortURL && userURLs[shortURL]) {
    const templateVars = {
      shortURL,
      longURL: urlDatabase[shortURL].longURL,
      user: users[req.session.user_id],
    };
    res.render("urls_show", templateVars);
  } else {
    res.render("urls_show", { shortURL, longURL: "" });
  }
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const doesEmailExist =
    getUserByEmail(email, users) &&
    getUserByEmail(email, users).email;

  console.log({ email, password, doesEmailExist });
  if (!email && !password) {
    res.status(400);
    res.send("Please fill out email and/or password");
  }

  if (doesEmailExist) {
    res.status(400);
    res.send("Email already exists");
  }

  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email,
    password: bcrypt.hashSync(password, 10),
  };

  console.log("user obj", users);
  req.session["user_id"] = userId;
  // res.cookie("user_id", userId);
  // console.log("cookies???", req.cookies);
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const userObj = getUserByEmail(email, users);
  // const comparePassword = bcrypt.compareSync(password)
  if (!userObj) {
    res.status(403);
    res.send("User not found");
  }

  if (userObj && bcrypt.compareSync(password, userObj.password)) {
    let templateVars = {
      user: userObj,
      urls: urlsForUser(userObj.id, urlDatabase),
    };
    // console.log("hello???", userObj.id);
    req.session["user_id"] = userObj.id;
    res.render("urls_index", templateVars);
  } else {
    res.status(403);
    res.send("Wrong password");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  // res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`urls/${randomString}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // is the user logged in
  const { shortURL } = req.params;
  const userURLs = urlsForUser(req.session.user_id);
  // does the logged in user own this shortURL
  if (userURLs && userURLs[shortURL] && userURLs[shortURL].longURL) {
    delete urlDatabase[shortURL];
    return res.redirect("/urls");
  } else {
    return res.redirect("/urls");
  }
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
