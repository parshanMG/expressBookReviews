const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({message: "Username and password are required"});
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).send({message: "Invalid username or password"});
  }
  const secretKey = 'fingerprint_customer'; 
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h'});
  req.session.token = token; // Store token in session

  return res.status(200).send({message: "User logged in successfully", token});


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username && req.user.username;
  const book = books[isbn];

  if (!book) {
    return res.status(404).send({message: "Book not found"});
  }

  if (!review) {
    return res.status(400).send({message: "Review is required"});
  }

  book.reviews[username] = review;
  return res.status(200).send({message: "Review added successfully", book});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.user.username && req.user.username;
  const book = books[parseInt(isbn)];

  if (!book) {
    return res.status(404).send({message: "Book not found"});
  }

  if (!book.reviews[username]) {
    return res.status(404).send({message: "Review not found for this user"});
  }

  delete book.reviews[username];
  return res.status(200).send({message: "Review deleted successfully", book});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
