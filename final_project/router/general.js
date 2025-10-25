const express = require('express');
const axios = require('axios');   // For async/await tasks
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

// ====================
// Task 6: Register User
// ====================
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    if (users.find(u => u.username === username)) return res.status(409).json({ message: "User already exists" });

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// ====================
// Task 1: Get all books
// ====================
public_users.get('/', (req,res) => {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// ====================
// Task 2: Get book by ISBN
// ====================
public_users.get('/isbn/:isbn', (req,res) => {
    const isbn = Number(req.params.isbn);
    const book = books[isbn];
    if (book) return res.status(200).json(book);
    return res.status(404).json({ message: "Book not found" });
});

// ====================
// Task 3: Get books by Author
// ====================
public_users.get('/author/:author', (req,res) => {
    const author = req.params.author.toLowerCase();
    let result = {};
    for (let key in books) {
        if (books[key].author.toLowerCase() === author) result[key] = books[key];
    }
    if (Object.keys(result).length > 0) return res.status(200).json(result);
    return res.status(404).json({ message: "No books found for this author" });
});

// ====================
// Task 4: Get books by Title
// ====================
public_users.get('/title/:title', (req,res) => {
    const title = req.params.title.toLowerCase();
    let result = {};
    for (let key in books) {
        if (books[key].title.toLowerCase() === title) result[key] = books[key];
    }
    if (Object.keys(result).length > 0) return res.status(200).json(result);
    return res.status(404).json({ message: "No books found with this title" });
});

// ====================
// Task 5: Get book reviews
// ====================
public_users.get('/review/:isbn', (req,res) => {
    const isbn = Number(req.params.isbn);
    const book = books[isbn];
    if (book) return res.status(200).json(book.reviews);
    return res.status(404).json({ message: "Book not found" });
});

// ====================
// Task 10: Get all books (async/await)
// ====================
public_users.get('/async-books', async (req, res) => {
    try {
        const getBooks = () => new Promise((resolve, reject) => {
            if (books) resolve(books);
            else reject("No books available");
        });
        const allBooks = await getBooks();
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

// ====================
// Task 11: Get book by ISBN (async/await)
// ====================
public_users.get('/async-isbn/:isbn', async (req, res) => {
    try {
        const isbn = Number(req.params.isbn);
        const getBookByISBN = (isbn) => new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) resolve(book);
            else reject("Book not found");
        });
        const book = await getBookByISBN(isbn);
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// ====================
// Task 12: Get books by Author (async/await)
// ====================
public_users.get('/async-author/:author', async (req,res) => {
    try {
        const author = req.params.author.toLowerCase();
        const getBooksByAuthor = (author) => new Promise((resolve, reject) => {
            let result = {};
            for (let key in books) {
                if (books[key].author.toLowerCase() === author) result[key] = books[key];
            }
            if (Object.keys(result).length > 0) resolve(result);
            else reject("No books found for this author");
        });
        const booksByAuthor = await getBooksByAuthor(author);
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// ====================
// Task 13: Get books by Title (async/await)
// ====================
public_users.get('/async-title/:title', async (req,res) => {
    try {
        const title = req.params.title.toLowerCase();
        const getBooksByTitle = (title) => new Promise((resolve, reject) => {
            let result = {};
            for (let key in books) {
                if (books[key].title.toLowerCase() === title) result[key] = books[key];
            }
            if (Object.keys(result).length > 0) resolve(result);
            else reject("No books found with this title");
        });
        const booksByTitle = await getBooksByTitle(title);
        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

module.exports.general = public_users;
