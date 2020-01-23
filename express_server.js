const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const randomatic = require("randomatic");

const { urlDatabase, users } = require("./data");
const { getUserByEmail, urlsForUser } = require("./helper");

const app = express();
const PORT = 8080; // default port 8080

app.use(methodOverride("_method"));

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
  if (req.session["user_id"]) {
    res.redirect("/urls");
  } else {
    res.render("urls_register");
  }
});

app.get("/login", (req, res) => {
  if (req.session["user_id"]) {
    res.redirect("/urls");
  } else {
    res.render("urls_login");
  }
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

// add new link for tinyapp
app.get("/urls/new", (req, res) => {
  if (users[req.session.user_id]) {
    res.render("urls_new", { user: users[req.session.user_id] });
  } else {
    res.redirect("/login");
  }
});

// redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  if (req.params.shortURL && urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.render("urls_error", { user: users[req.session.user_id] });
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const { user_id: sessionID } = req.session;
  // if not logged in
  if (!sessionID) {
    res.render("urls_error");
  } else {
    const { shortURL } = req.params;
    const urlObj = urlsForUser(sessionID);
    // if user is logged in but it's not their short URL
    if (urlObj[shortURL]) {
      const templateVars = {
        shortURL,
        longURL: urlObj[shortURL].longURL,
        user: users[sessionID],
      };
      res.render("urls_show", templateVars);
    } else {
      res.render("urls_error", { user: users[sessionID] });
    }
  }
});

// redirect any stray url request to urls
app.get("*", (req, res) => {
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const doesEmailExist = getUserByEmail(email, users);

  if (!email && !password) {
    res.status(400).render("urls_error", {
      error: {
        statusCode: 400,
        message: "Please fill out email and/or password",
      },
    });
  }

  if (doesEmailExist) {
    res.status(400).render("urls_error", {
      error: {
        statusCode: 400,
        message: "Email already exists",
      },
    });
  }

  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email,
    password: bcrypt.hashSync(password, 10),
  };

  req.session["user_id"] = userId;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const userObj = getUserByEmail(email, users);

  // if user with email exists + password is correct
  if (userObj && bcrypt.compareSync(password, userObj.password)) {
    let templateVars = {
      user: userObj,
      urls: urlsForUser(userObj.id, urlDatabase),
    };
    req.session["user_id"] = userObj.id;
    res.render("urls_index", templateVars);
  } else {
    res.status(403).render("urls_error", {
      error: {
        statusCode: 403,
        message: "Could not find a user with that email/password.",
      },
    });
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// add a new URL to urlDatabase
app.post("/urls", (req, res) => {
  const randomString = generateRandomString();
  const { longURL } = req.body;
  urlDatabase[randomString] = {
    longURL,
    userID: req.session.user_id,
  };
  res.redirect(`urls/${randomString}`);
});

// update the url
app.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const { newURL } = req.body;
  const { user_id: sessionID } = req.session;
  const userURLs = urlsForUser(sessionID);

  if (sessionID && userURLs && userURLs[shortURL]) {
    urlDatabase[shortURL].longURL = newURL;
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.render("urls_error");
  }
});

// delete the url
app.post("/urls/:shortURL/delete", (req, res) => {
  // is the user logged in
  const { shortURL } = req.params;
  const userURLs = urlsForUser(req.session.user_id);
  // does the logged in user own this shortURL
  if (userURLs && userURLs[shortURL]) {
    delete urlDatabase[shortURL];
    return res.redirect("/urls");
  } else {
    return res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
