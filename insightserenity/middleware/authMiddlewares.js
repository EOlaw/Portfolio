// Import the necessary modules.
const User = require('../models/userModel');
const Consultant = require('../models/consultantModel')
const Client = require('../models/clientModel')
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
        res.status(401).json({ error: 'You must be logged in to access this resource' });
        //req.flash('error', 'You must be signed in first!')
        return res.redirect('/')
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
                    return res.status(403).send('Access denied. You are not allowed to access.');
                }
            })
            .catch((err) => {
                console.error('Error while checking admin status:', err);
                return res.status(500).send('Internal Server Error');
            });
    } else {
        // If the user is not authenticated, redirect to the login page
        console.log('User is not authenticated. Redirecting to /user/login');
        return res.status(401).json({ error: 'You must be logged in to access this resource'})
        //res.redirect('/');
    }
}

// Middleware to check if user is authorized as consultant
function isConsultant(req, res, next) {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        // Retrieve the user from the database
        User.findById(req.user._id)
            .then((user) => {
                if (user && user.role === 'consultant') {
                    // If the user is a consultant, allow access to the route
                    next();
                } else {
                    // If the user is not a consultant, deny access with status 403
                    console.log('User is not authorized as consultant. Access denied.');
                    return res.status(403).send('Access denied. You are not allowed to access.');
                }
            })
            .catch((err) => {
                console.error('Error while checking authorization as consultant:', err);
                return res.status(500).send('Internal Server Error');
            });
    } else {
        // If the user is not authenticated, redirect to the login page
        console.log('User is not authenticated. Redirecting to /user/login');
        return res.status(401).json({ error: 'You must be logged in to access this resource' })
        //res.redirect('/user/login');
    }
}

// Middleware to check if user is authorized as client
function isClient(req, res, next) {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        // Retrieve the user from the database
        User.findById(req.user._id)
            .then((user) => {
                if (user && user.role === 'client') {
                    // If the user is a client, allow access to the route
                    next();
                } else {
                    // If the user is not a client, deny access with status 403
                    res.status(403).send('Access denied. You are not allowed to access.');
                }
            })
            .catch((err) => {
                console.error('Error while checking authorization as client:', err);
                res.status(500).send('Internal Server Error');
            });
    } else {
        // If the user is not authenticated, redirect to the login page
        console.log('User is not authenticated. Redirecting to /user/login');
        return res.status(401).json({ error: 'You must be logged in to access this resource' })
        // res.status(401).redirect('/insightserenity/user/login');
    }
}

module.exports = { isAuthenticated, isAdmin, isConsultant, isClient }