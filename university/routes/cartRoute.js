/*
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated, isAdmin } = require('../controllers/authController')

// Routes for shopping cart
router.route('/')
    .get(isAuthenticated, cartController.getCart)
router.route('/add')
    .post(isAuthenticated, cartController.addToCart)
router.route('/update')
    .put(isAuthenticated, cartController.updateQuantity)
router.route('/remove/:courseId')
    .get(isAuthenticated, cartController.removeFromCart)
// Define the route for enrolling in courses
router.route('/:userId/course/:courseId/enroll')
    .post(isAuthenticated, cartController.enrolledUserInCourse)


module.exports = router;

*/