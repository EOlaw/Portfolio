// Import the necessary modules.
const User = require('../models/userModel');
const passport = require('passport');
/*
function checkContractorRole(req, res, next) {
    if (req.user.role === 'contractor') {
        return next(); // Allow access to the route
    } else {
        res.status(403).send('Access denied. You are not allowed to access.');
    }
}
*/

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/user/login')
    }
    next()
}

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        // Retrieve the user from the database
        User.findById(req.user._id)
            .then((user) => {
                if (user && user.isAdmin) {
                    // If the user is admin, allow access to the route
                    next();
                } else {
                    // If the user is not admin, deny access with status 403
                    console.log('User is not admin. Access denied.');
                    res.status(403).send('Access denied. You are not allowed to access.');
                }
            })
            .catch((err) => {
                console.error('Error while checking admin status:', err);
                res.status(500).send('Internal Server Error');
            });
    } else {
        // If the user is not authenticated, redirect to the login page
        console.log('User is not authenticated. Redirecting to /user/login');
        res.redirect('/user/login');
    }
}

// Middleware to check if user is admin or instructor
function isAuthorizedAsInstructor(req, res, next) {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        // Retrieve the user from the database
        User.findById(req.user._id)
            .then((user) => {
                if (user && (user.isAdmin || user.role === 'instructor')) {
                    // If the user is admin or instructor, allow access to the route
                    next();
                } else {
                    // If the user is neither admin nor instructor, deny access with status 403
                    console.log('User is not authorized as instructor. Access denied.');
                    res.status(403).send('Access denied. You are not allowed to access.');
                }
            })
            .catch((err) => {
                console.error('Error while checking authorization as instructor:', err);
                res.status(500).send('Internal Server Error');
            });
    } else {
        // If the user is not authenticated, redirect to the login page
        console.log('User is not authenticated. Redirecting to /user/login');
        res.redirect('/user/login');
    }
}

// Middleware to check if user is admin or instructor
function isAuthorizedAsStudent(req, res, next) {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        // Retrieve the user from the database
        User.findById(req.user._id)
            .then((user) => {
                if (user && (user.isAdmin || user.role === 'student')) {
                    // If the user is admin or student, allow access to the route
                    next();
                } else {
                    // If the user is neither admin nor instructor, deny access with status 403
                    console.log('User is not authorized as student. Access denied.');
                    res.status(403).send('Access denied. You are not allowed to access.');
                }
            })
            .catch((err) => {
                console.error('Error while checking authorization as student:', err);
                res.status(500).send('Internal Server Error');
            });
    } else {
        // If the user is not authenticated, redirect to the login page
        console.log('User is not authenticated. Redirecting to /user/login');
        res.redirect('/user/login');
    }
}

module.exports = { isAuthenticated, isAdmin, isAuthorizedAsInstructor, isAuthorizedAsStudent }