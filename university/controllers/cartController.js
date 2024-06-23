/*
const Cart = require('../models/cartModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Controller methods for shopping cart
const cartController = {
    // Get user's cart with total price
    getCart: async (req, res) => {
        try {
            const cart = await Cart.findOne({ user: req.user._id }).populate('courses');
            
            // Check if cart exists
            if (!cart) {
                return res.render('cart/getCart', { cart: null, totalPrice: 0 });
            }
    
            // Fetch course data for each course in the cart
            const courses = await Promise.all(cart.courses.map(async courseId => {
                const course = await Course.findById(courseId);
                return course;
            }));
    
            const totalPrice = await cart.calculateTotalPrice();
            res.render('cart/getCart', { cart, totalPrice, currentUser: req.user, courses });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Add course to the cart
    addToCart: async (req, res) => {
        try {
            const { courseId } = req.body;
            const cart = await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $addToSet: { courses: courseId } },
                { new: true, upsert: true }
            ).populate('courses');
            const totalPrice = await cart.calculateTotalPrice();
            
            // Fetch course data for each course in the cart
            const courses = await Promise.all(cart.courses.map(async courseId => {
                const course = await Course.findById(courseId);
                return course;
            }));
    
            res.render('cart/getCart', { cart, totalPrice, currentUser: req.user, courses });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    
    

    // Remove course from the cart
    removeFromCart: async (req, res) => {
        try {
            const { courseId } = req.params;
            const cart = await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { courses: courseId } },
                { new: true }
            ).populate('courses');
            const totalPrice = await cart.calculateTotalPrice(); // Recalculate total price
            res.redirect('/cart/'); // Redirect to the cart page
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    // Update quantity of a course in the cart
    updateQuantity: async (req, res) => {
        try {
        const { courseId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        // Check if the course exists in the cart
        const courseIndex = cart.courses.findIndex(course => course.toString() === courseId.toString());
        if (courseIndex === -1) {
            res.status(404).json({ message: 'Course not found in the cart.' });
            return;
        }

        // Update quantity of the course
        cart.courses[courseIndex].quantity = quantity;
        await cart.save();

        // Calculate total price
        const totalPrice = await cart.calculateTotalPrice();

        res.json({ cart, totalPrice });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    },
    enrolledUserInCourse: async (req, res, next) => {
        try {
            // Fetch user and course
            const userId = req.params.userId;
            const courseId = req.params.courseId;
            const user = await User.findById(userId);
            const course = await Course.findById(courseId);

            // Check if user and course exist
            if (!user || !course) {
            return res.status(404).json({ error: 'User or course not found' });
            }

            // Check if the user is an instructor
            if (user.role === 'instructor' || user.role === 'center') {
                return res.status(403).json({ error: 'Instructors are not allowed to enroll in courses' });
            }

            // Check if the course is active and has available slots
            if (course.enrollmentLimit && course.students.length >= course.enrollmentLimit) {
                return res.status(400).json({ error: 'The course has reached its enrollment limit' })
            }

            // Proceed with enrollment
            user.enrolledCourses.push(courseId);
            course.students.push(userId);
            await Promise.all([user.save(), course.save()]);

            // Update enrollment limit
            if (course.enrollmentLimit) {
                course.enrollmentLimit--;
                await course.save();
            }
  
            res.redirect(`/user/enrolled-courses/${userId}`);
            //res.status(200).json({ message: 'Enrollment Successful', user, course })
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    },
};

module.exports = cartController;

*/
