function generateRandomString() {
  let randomString = '';
  let characters = 'AB9wxyz';
  for (let i = 0; i < characters.length; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return randomString;
}

function getUserByEmail(email, users) {
  for (let id in users) {
      if (users[id].email === email) {
          return users[id];
      }
  }
  return undefined;
}

function urlsForUser(id, urlDatabase) {
  let userUrls = {};
  for (let shortUrl in urlDatabase) {
      if (urlDatabase[shortUrl].userID === id) {
          userUrls[shortUrl] = urlDatabase[shortUrl].longURL;
      }
  }
  return userUrls;
}

module.exports = { generateRandomString, getUserByEmail, urlsForUser };