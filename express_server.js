const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = 8080; // default port 8080


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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
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

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls");

})

