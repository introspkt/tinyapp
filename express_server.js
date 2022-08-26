const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.use(express.urlencoded({ extended: true }));
function generateRandomString(){
  return Math.random().toString(36).slice(2, 8);
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

//If email in user object
const getEmail = function(obj, str) {
  for (const id in obj) {
    if (obj[id].email === str) {
      // console.log(true);
      return true; // Invalid - if email is in obj, return true
    }
  }
};

//If email in database 
const checkUserPresence = function(obj, email, pwd) {
  for (const id in obj) {
    if ((obj[id].email === email) && (obj[id].password === pwd)) {
      // console.log(true);
      return true; // Valid - email & password pair exists, so user exists
    }
  }
};



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies["user"], userID: req.cookies["user_id"]}; 
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
  res.send(generateRandomString())
});

//URLS 
app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.cookies["user"], userID: req.cookies["user_id"]};
  res.render("urls_new", templateVars);
  
});

// Login Homepage
app.get("/login", (req, res) => {
  const templateVars = {urls: urlDatabase, user: req.cookies["user"], userID: req.cookies["user_id"]};
  res.render("urls_login", templateVars)
})

/*---Actions with URLs---*/
//  Create new URLs page
app.get("/urls/new", (req, res) => {
  const templateVars = {user: req.cookies["user"], user: req.cookies ["user"], user: req.cookies["user_id"]};
  res.render("urls_new", templateVars);
});

// Creating New URL/Showing URL
app.post("/urls", (req, res) => {
  console.log(req.body); 
  //res.send("Ok"); 
  let randomString = generateRandomString();
  urlDatabase[randomString] = {longURL: req.body.longURL, userID: req.cookies["user_id"].id};
  res.redirect(`/urls/${randomString}`)

});

//  longURL to shortURL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, long_URL: urlDatabase[req.params.shortURL].longURL, user: req.cookies["user"], userID: req.cookies["user_id"]};
  res.render("urls_show", templateVars);
});

// Deleting URLS
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  delete urlDatabase[req.params.shortURL], req.params.shortURL; // Deletes URL entry
  res.redirect("/urls"); // Redirects to main urls_index page
});

// Hyperlinks short URL to long URL 
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// Edit URL from /URLs homepage
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

//User Accounts Section
//Registration Section 
app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies, user: req.cookies["user"], userID: req.cookies["user_id"]}; 
  res.render("urls_register", templateVars);
});

//Registration through form
app.post("/register", (req, res) => {
  // Variables needed for error evaluations:
  const randomUserID = generateRandomString();
  const userEmail = req.body.email; // just the email
});

//Evaluation In Case of Error 
let evaluation = (getEmail(users, userEmail));
  if (evaluation === true) {
    console.log(`Error: 400. Email is already in use`);
    res.status(400).send(`Error: 400. Email is already in use`);
  }

  // If email OR pwd are empty strings ...
  if ((!req.body.email) || (!req.body.password)) {
    console.log(`Error: 400. Invalid email or password`);
    res.status(400).send(`Error: 400. Invalid email or password`);
  }

  //Login Part
app.get("/login", (req, res) => {
  res.redirect("/urls")
});

//Collecting cookies at login
app.post("/login", (req, res) => {
  console.log(req.body);

  res.cookie("username", req.body.username);

  res.redirect("/urls");
});

//Logout Part
app.get("/logout", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  let randomUserID = generateRandomString(); // generate randomUserID  
  users[randomUserID] = {
    id: randomUserID,
    email: req.body.email,
    password: req.body.password
  };

  //Cookies Part
  const userObj = users[randomUserID];
  res.cookie("username", randomUserID)
  res.redirect("/urls")
});

//Login In Header
app.get("/login", (req, res) => {
  const templateVars = {user: req.cookies["user"], userID: req.cookies["user_id"]};
  res.render("urls_login", templateVars); // Loads up the login page
  res.redirect("/urls"); // redirects user to main page
});

//Collecting Cookies Upon Login 
app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userPresence = checkUserPresence(users, userEmail, userPassword);
});

 //Removing cookies upon logging out 
app.post("/logout", (req, res) => {
  console.log(req.body); 
  res.clearCookie("username");
  res.redirect("/urls");
});

// Error evaluations:
  // If email OR password are empty strings ...
  if ((!userEmail) || (!userPassword)) {
    res.status(403).send(`Error: 403. Invalid email or password`);
  }

 // If email already has an account ...
 if (userPresence !== true) {
  res.status(403).send(`Error: 403. Incorrect input`);
} 

// Happy state:
res.cookie("user", req.body); 
res.redirect("/urls");

// Logout Through Header 
app.get("/logout", (req, res) => {
  const templateVars = {user: req.cookies["user"], userID: req.cookies["user_id"]};
  res.render("urls_show", templateVars); // Passes "user" to /logout route
  res.redirect("/urls");
});



