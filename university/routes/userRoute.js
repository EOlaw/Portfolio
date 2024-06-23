const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/userModel');
const userControllers = require('../controllers/userController');
const { isAuthenticated, isAdmin, isAuthorizedAsInstructor, isAuthorizedAsStudent } = require('../controllers/authController');

router.route('/register')
    .get(userControllers.renderRegister)
    .post(userControllers.registerUser);

router.route('/login')
   .get(userControllers.renderLogin)
   .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), userControllers.loginUser)

router.route('/logout')
    .get(userControllers.logout)

//router.route('/')
    //.get(isAuthenticated, isAdmin, userControllers.getAllUsers)

router.route('/:id')
    .get(isAuthenticated, isAdmin, userControllers.getUser)
    .put(isAuthenticated, isAdmin, userControllers.updateUser)
    .delete(isAuthenticated, userControllers.deleteUser)

// Route for adding a course to the cart
router.route('/cart/')
    .post(userControllers.addToCart);
router.route('/cart/:userId')
    .get(isAuthenticated, userControllers.viewCart)
router.route('/cart/:userId/remove/:courseId')
    .get(userControllers.removeFromCart);
// Route for proceeding to checkout
router.route('/cart/proceed-to-checkout/:userId')
    .post(isAuthenticated, userControllers.proceedToCheckout);

router.route('/enrolled-courses/:userId')
    .get(isAuthenticated, userControllers.viewEnrolledCourse)
router.route('/:userId/course/:courseId/enroll')
    .post(userControllers.enrolledUserInCourse)
router.route('/:userId/course/:courseId/complete')
    .post(userControllers.completeCourse)

router.route('/students/:userId/course/:courseId/remove')
    .post(isAuthenticated, userControllers.removeStudentFromCourse)



//////////////////////////////  INSTRUCTORS //////////////////////////////////
router.route('/:userId/instructor-dashboard')
    .get( isAuthorizedAsInstructor, userControllers.renderInstructorDashboard)


//////////////////////////////  STUDENTS //////////////////////////////////
router.route('/:userId/student-dashboard')
    .get( isAuthorizedAsStudent, userControllers.renderStudentDashboard)

module.exports = router;