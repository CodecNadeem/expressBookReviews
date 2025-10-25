const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Helper functions
const isValid = (username) => users.some(u => u.username === username);
const authenticatedUser = (username, password) => users.some(u => u.username === username && u.password === password);

// Task 7: Login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    if (!authenticatedUser(username, password)) return res.status(401).json({ message: "Invalid username or password" });

    const accessToken = jwt.sign({ username }, 'access_secret_key', { expiresIn: '1h' });

    req.session = req.session || {};
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User logged in successfully", accessToken });
});

// Task 8: Add/Modify Book Review
regd_users.put("/auth/review/:isbn", (req,res) => {
    const isbn = Number(req.params.isbn);
    const book = books[isbn];
    const username = req.session?.authorization?.username;

    if (!username) return res.status(403).json({ message: "User not logged in" });
    if (!book) return res.status(404).json({ message: "Book not found" });

    const { review } = req.body;
    if (!review) return res.status(400).json({ message: "Review cannot be empty" });

    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added/modified successfully", reviews: book.reviews });
});

// Task 9: Delete Book Review
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = Number(req.params.isbn);           // Get ISBN from URL
    const book = books[isbn];                       // Look up book
    const username = req.session?.authorization?.username; // Logged-in user

    // Check if user is logged in
    if (!username) return res.status(403).json({ message: "User not logged in" });

    // Check if book exists
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check if user has a review for this book
    if (book.reviews[username]) {
        delete book.reviews[username]; // Delete the review
        return res.status(200).json({
            message: "Review deleted successfully",
            reviews: book.reviews
        });
    } else {
        return res.status(404).json({ message: "No review found for this user" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
