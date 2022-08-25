const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
  res.send(generateRandomString())
});


app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.cookies["user"], userID: req.cookies["user_id"],};
  res.render("urls_new", templateVars);
  
});

app.post("/urls", (req, res) => {
  console.log(req.body); 
  //res.send("Ok"); 
  let randomString = generateRandomString();
  urlDatabase[randomString]= req.body.longURL;
  res.redirect(`/urls/${randomString}`)

});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase [req.params.id]
  res.redirect(longURL);
});

//For Short URLS 
app.post("/urls/:shortURL/delete",(req, res) => {
  console.log(req.body);
  delete urlDatabase[req.params.shortURL], req.params.shortURL;
  res.redirect("/urls");
});

//Registration Section 
app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies, user: req.cookies["user"], userID: req.cookies["user_id"],}; 
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
  } 
  res.cookie("username", randomUserID)
  res.redirect("/urls")
});

//Login In Header
app.get("/login", (req, res) => {
  const templateVars = {/*username: req.cookies["username"]*/ user: req.cookies["user"], userID: req.cookies["user_id"],};
  res.render("urls_show", templateVars); // Passes "username" to /login route
  res.redirect("/urls");
});

//Removing cookies upon logging out 
app.post("/logout", (req, res) => {
  console.log(req.body); 
  res.clearCookie("username");
  res.redirect("/urls");
});


