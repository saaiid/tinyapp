const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
// const morgan = require('morgan');
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helpers');
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');
const PORT = 8080; // default port 8080



app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
  );
app.set('view engine', 'ejs')
// //middleware
// app.use(morgan('dev'))


//users login 
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};






//registration page
app.get("/register", (req, res) =>{
  const userId = req.session.user_id;

  if (userId) {
    res.redirect("/urls");
  } else {
    const user = users[userId];
    const templateVars = { user };
    res.render("urls_registration", templateVars);
  }
})

//login page
app.get("/login", (req, res) => {
  const userId = req.session.user_id;

  if (userId) {
    return res.redirect("/urls");
  }
  const user = users[userId];
  const templateVars = { user };
  res.render("login", templateVars);
});

//urls page
app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  
  if (!userId) {
    return res.send("<html><body>You are not logged in</body></html>\n");
  }
  const user = users[userId];
  const userUrls = urlsForUser(userId, urlDatabase);
  
  const templateVars = { urls: userUrls, user };
  res.render("urls_index", templateVars);
});

//New urls page
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;

  if (!userId) {
    return res.redirect("/login");
  }
  const user = users[userId];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

//Urls page with shortUrl
app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;

  const shortUrl = req.params.id;

  if (!userId) {
    return res.send("<html><body>You are not logged in</body></html>\n");
  }
  if (!urlDatabase[shortUrl]) {
    return res.send("<html><body>Error: This short URL does not exist</body></html>\n");
  }
  const userUrls = urlsForUser(userId, urlDatabase);
  if (!userUrls[shortUrl]) {
    return res.send("<html><body>Error: You do not have access to this url</body></html>\n");
  }

  const user = users[userId];
  const templateVars = {
    id: shortUrl,
    longURL: urlDatabase[req.params.id].longURL,
    user,
  };
  res.render("urls_show", templateVars);
})


app.get("/u/:id", (req, res) => {
  const shortUrl = req.params.id;
  if (!urlDatabase[shortUrl]) {
    res.send("<html><body>You cannot reach this URL it does not exist.</body></html>\n");
  } else {
    const longURL = urlDatabase[req.params.id].longURL;
    res.redirect(longURL);
  }
});

app.get("/", (req, res) => {
  const userId = req.session.user_id;
  if (userId) {
    return res.redirect("/urls");
  }
  res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//POST REQUEST

app.post("/urls", (req, res) => {
  const userId = req.session.user_id ;

  const shortUrl = generateRandomString();
  const longURL = req.body.longURL;

  if (!userId) {
    return res.send("<html><body>You cannot shorten URL, please login first.</body></html>\n");
  }

  urlDatabase[shortUrl] = { longURL, userID: userId };
  res.redirect(`/urls/${shortUrl}`);
})

app.post("/register", (req, res) =>{
  const id = generateRandomString();
  //store and grab email from registration page to a variable
  const email = req.body.email;
  //store and grab password from registration page to a variable
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  
  //Check if they didn't give us username or password
  if(!email || !password) {
    return res.status(400).send('Enter an email and password to register')
  }
  //store and generate new ID using my generate ID function
  if (user) {
    return res.status(400).send("ERROR: email address already registered.");
  }

  users[id] = { id, email, password: bcrypt.hashSync(password, 10) };
  
  req.session.user_id = id;
  res.redirect("/urls");
})

app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;

  const shortUrl = req.params.id;

  if (!userId) {
    return res.send("<html><body>You are not logged in</body></html>\n");
  } if (!urlDatabase[shortUrl]) {
    return res.send("<html><body>ERROR: This short URL does not exist</body></html>\n");
  }

  const userUrls = urlsForUser(userId, urlDatabase);
  if (!userUrls[shortUrl]) {
    return res.send("<html><body>ERROR: You do not have access to this url. </body></html>\n");
  }

  delete urlDatabase[shortUrl];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id ;

  const shortUrl = req.params.id;
  const longURL = req.body.longURL;
  if (!userId) {
    return res.send("<html><body>You are not logged in.</body></html>\n");
  }
  if (!urlDatabase[shortUrl]) {
    return res.send("<html><body>ERROR: This short URL does not exist.</body></html>\n");
  }
  const userUrls = urlsForUser(userId, urlDatabase);
  if (!userUrls[shortUrl]) {
    return res.send("<html><body>ERROR: You do not have access to this url. </body></html>\n");
  }

  urlDatabase[shortUrl].longURL = longURL;
  res.redirect("/urls");
});

//post login
app.post("/login", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(403).send("ERROR: please enter a valid email address and password.");
  }
  const user = getUserByEmail(email, users);
  if (!user) {
    return res.status(403).send("ERROR: please enter a registered email.");
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("ERROR: please enter correct password.");
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
})

//post logout 
app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect("/login");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
