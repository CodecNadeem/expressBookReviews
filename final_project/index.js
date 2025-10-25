const express = require('express');
const session = require('express-session');
const app = express();

// Import routers from router folder
const public_users = require('./router/general.js').general;       // Tasks 1–6
const regd_users = require('./router/auth_users.js').authenticated; // Tasks 7–9

// Middleware to parse JSON bodies
app.use(express.json());

// Configure session
app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Mount routes
app.use("/", public_users);          // Public routes: get books, register, etc.
app.use("/customer", regd_users);    // Registered user routes: login, review add/delete

// Optional: Authentication middleware for /customer/auth/*
app.use("/customer/auth/*", (req, res, next) => {
    if (req.session && req.session.authorization) {
        next();
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
