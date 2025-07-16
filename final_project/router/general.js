const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const BASE_URL = "http://localhost:5000";


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({message: "Username and password are required"});
  } 
  const exisitingUser = users.some(user => user.username === username);
  if (exisitingUser) {
    return res.status(400).send({message: "Username already exists"});
  };
  users.push({ username, password });
  return res.status(201).send({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(books[isbn]);
  } else {
    return res.status(404).send({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const booksByAuthor = [];

  for(const isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
      booksByAuthor.push(books[isbn]);
    }
  }
  if (booksByAuthor.length > 0) {
    return res.status(200).send(booksByAuthor);
  } else{
    return res.status(404).send({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const booksByTitle = [];
  for(const isbn in books) {
    if (books[isbn].title.toLowerCase().includes(title)) {
      booksByTitle.push(books[isbn]);
    }
  };
  if (booksByTitle.length > 0) {
    return res.status(200).send(booksByTitle);
  } else {
    return res.status(404).send({message: "No books found with this title"});
  };
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book){
    return res.status(200).send(book.reviews);
  } else{
    return res.status(404).send({message: "Book not found"});
  }
});

module.exports.general = public_users;

async function task10_getALlBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log("task 10 - All books:");
    console.log(JSON.stringify(response.data, null, 4));
  } catch (err) {
    console.error("Error fetching all books:", err.message);
  }
};

async function task11_getBookByISBN(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    console.log(`task 11 - Book with ISBN ${isbn}:`);
    console.log(JSON.stringify(response.data, null, 4));
  } catch (err) {
    console.error(`Error fetching book with ISBN ${isbn}:`, err.message);
  }
};
async function task12_getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    console.log(`task 12 - Books by author ${author}:`);
    console.log(JSON.stringify(response.data, null, 4));
  } catch (err) {
    console.error(`Error fetching books by author ${author}:`, err.message);
  }
};
async function task13_getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    console.log(`task 13 - Books with title ${title}:`);
    console.log(JSON.stringify(response.data, null, 4));
  } catch (err) {
    console.error(`Error fetching books with title ${title}:`, err.message);
  }
};
task13_getBooksByTitle("the divine comedy");
