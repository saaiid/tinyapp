const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const { application } = require("express");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const PORT = 8080; // default port 8080

app.set('view engine', 'ejs')

//middleware
app.use(morgan('dev'))


//users login 
const users = {
  id: {
    id: "abc",
    email: "alice",
    password: "123",
  },
 
};


function generateRandomString() {
  let randomString = '';
  let characters = 'AB9wxyz';
  for(let i = 0; i < characters.length; i++){
    randomString+= characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return randomString;
}



app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};

app.get("/u/:id", (req, res) => {
  // const longURL = ...
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  console.log(req.cookies["username"])
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars)
});

app.post("/urls", (req, res) => {
  const randomKey = generateRandomString();
  console.log(randomKey);
  urlDatabase[randomKey] = req.body.longURL;
  //const longURL = req.body.longURL
  console.log(req.body); // Log the POST request body to the console
  res.redirect(`/urls/${randomKey}`)
})


app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
  
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id
  const templateVars = {
    id: shortURL,
    longURL: urlDatabase [shortURL],
    username: req.cookies["username"],
  }

  res.render("urls_show", templateVars)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls");

})

app.post("/urls/:id/edit", (req, res) =>{
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls");
})

//post login
app.post("/login", (req,res) => {
  res.cookie("username", req.body.username)
  res.redirect("/urls");
})

//post logout 
app.post("/logout", (req,res) => {
  res.clearCookie("username")
  res.redirect("/urls");
})

//registration page
app.get("/register", (req, res) =>{
 res.render("urls_registration")
})


app.post("/register", (req, res) =>{
/*   const users: {
    id: "uid",
    email: "ualice",
    password: "123",
  }, */

  //store and grab email from registration page to a variable
  const email = req.body[email];
  //store and grab password from registration page to a variable
  const password = req.body[password];

  //Check if they didn't give us username or password
  if(!email || !password) {
    return res.status(400).send('Please provide a username and a password')
  }
  //store and generate new ID using my generate ID function

  //aad global user object

  //redirect /urls page
  res.redirect("/urls");

})






