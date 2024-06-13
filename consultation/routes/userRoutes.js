const express = require('express');
const router = express.Router();
const passport = require('passport');
const userControllers = require('../controllers/userControllers');
const { isAuthenticated, isClient } = require('../controllers/authControllers');


// User routes
router.route('/register')
    .get(userControllers.renderRegister)
    .post(userControllers.registerUser);

router.route('/login')
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), userControllers.loginUser)
    .get(userControllers.renderLogin)

router.route('/logout')
    .get(isAuthenticated, userControllers.logoutUser);

router.route('/dashboard')
    .get(userControllers.getDashboard);

router.route('/')
    .get(isAuthenticated, userControllers.getUsers);

router.route('/delete/:id')
    .post(isAuthenticated, userControllers.deleteUser);

module.exports = router;
