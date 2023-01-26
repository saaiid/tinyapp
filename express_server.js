const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = 8080; // default port 8080

generateRandomString()
function generateRandomString() {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  for(let i = 0; i < characters.length; i++){
    randomString+= characters.charAt(Math.floor(Math.random() * characters.length))
  }
  console.log(randomString);
}


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL
  console.log(req.body); // Log the POST request body to the console
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id
  const templateVars = {
    id: shortURL,
    longURL: urlDatabase [shortURL]
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

