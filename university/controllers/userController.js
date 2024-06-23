const User = require('../models/userModel')
const Course = require('../models/courseModel')
const Cart = require('../models/cartModel')

const userControllers = {
    // Register Page
    renderRegister: (req, res) => {
        res.render('users/register')
    },
    // Create a new user
    registerUser: async (req, res, next) => {
        try {
            const user = new User(req.body);
            await user.setPassword(req.body.password); //Use setPassword method provided by passport-local-mongoose to set the password
            await user.save();
            req.login(user, err => {
                if (err) return next(err);
                req.flash('success', 'Welcome to Education Website!')
                res.redirect('/');
                console.log(user)
                //res.json({ message: 'User registered successfully', user });
            })
        } catch (err) {
            req.flash('error', err.message);
            console.log(err);
            res.redirect('/user/register')
        }
    },
    // Login Page
    renderLogin: (req, res) => {
        //res.json('Login Page')
        res.render('users/login')
    },
    
    // Login
    loginUser: async (req, res, next) => {
        try {
            const { username, password, role } = req.body;
            const user = await User.findOne({ username });

            // Check if user exists and password is correct
            if (!user || !(await user.isPasswordSame(password))) {
                req.flash('error', 'Invalid username or password');
                return res.redirect('/user/login');
            }

            // If user is admin, log them in directly
            if (user.isAdmin) {
                req.login(user, (err) => {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }
                    return res.redirect('/');
                });
                return;
            }

            // If role is not selected or mismatched, render login page with message
            if (!user.role || role !== user.role) {
                req.flash('error', 'You are not authorized to log in as ' + role);
                return res.redirect('/user/login');
            }

            // Log in the user
            req.login(user, (err) => {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                // Redirect based on user's role
                if (role === 'student' || role === 'parent') {
                    return res.redirect(`/user/${user._id}/student-dashboard`);
                } else if (role === 'instructor' || role === 'center') {
                    return res.redirect(`/user/${user._id}/instructor-dashboard`); // Use user._id instead of userId
                } else {
                    return res.redirect('/');
                }
            });
        } catch (err) {
            console.log(err);
            req.flash('error', 'An error occurred. Please try again later.');
            res.redirect('/user/login');
        }
    },


    // Logout
    logout: (req, res) => {
        // Check if the user is authenticated
        if (!req.isAuthenticated()) {
            // If the user is not logged in, send a response indicating that the user must be logged in
            return res.status(401).json({ error: 'You must be logged in to perform this action' });
        }
        req.logout((err) => {
            if (err) {
                // Handle any errors that occur during the logout process
                console.log(err);
            }
            req.flash('success', 'Goodbye!');
            //res.json('User logged out successfully');
            res.redirect('/')
        });
    },
    
    // Get a single user
    getUser: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json(user)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    },
    // Update a user
    updateUser: async (req, res, next) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' })
            }
            res.status(200).json(updatedUser)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    },
    // Delete a user
    deleteUser: async (req, res, next) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' })
            }
            // Also handle removal of enrolled courses when deleting a user
            await Course.updateMany(
                { _id: { $in: deletedUser.enrolledCourses } },
                { $pull: { students: deletedUser._id } }
            );
            res.status(200).json(deletedUser)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    },
    addToCart: async (req, res, next) => {
        try {
            const { courseId } = req.body;
            const cart = await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $addToSet: { courses: courseId } },
                { new: true, upsert: true }
            ).populate('courses');
            console.log('Cart:', cart);
            const totalPrice = await cart.calculateTotalPrice();
            const courses = await Course.find({_id: { $in: cart.courses }});
            // Redirect to the viewCart route with query parameters
            res.redirect(`/user/cart/${req.user._id}`)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    viewCart: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId).populate('enrolledCourses');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const cart = await Cart.findOne({ user: userId }).populate('courses');
            console.log('Cart:', cart);

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
            res.render('cart/viewCart', { cart, totalPrice, currentUser: req.user, enrolledCourses: user.enrolledCourses, courses })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },
    removeFromCart: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const courseId = req.params.courseId; // Assuming courseId is sent in the request body
    
            // Find the user's cart
            const cart = await Cart.findOne({ user: userId });
    
            // Check if the cart exists
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }
    
            // Remove the course from the cart
            await Cart.updateOne({ _id: cart._id }, { $pull: { courses: courseId } });
    
            // Send a success response
            res.redirect(`/user/cart/${userId}`)
            //res.status(200).json({ message: 'Course removed from cart successfully' });
        } catch (error) {
            // Handle errors
            res.status(500).json({ error: error.message });
        }
    },
    proceedToCheckout: async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId);
            const cart = await Cart.findOne({ user: userId }).populate('courses');
    
            // Check if cart exists
            if (!cart || !user) {
                return res.status(404).json({ error: 'Cart or user not found' });
            }
    
            // Iterate over courses in the cart and enroll the user in each course
            for (const courseId of cart.courses) {
                const course = await Course.findById(courseId);
    
                // Check if user and course exist
                if (!course) {
                    return res.status(404).json({ error: `Course with ID ${courseId} not found` });
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
            }
    
            // Clear the user's cart after enrollment
            cart.courses = [];
            await cart.save();
    
            res.redirect(`/user/enrolled-courses/${userId}`);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    viewEnrolledCourse: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId).populate('enrolledCourses');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const cart = await Cart.findOne({ user: userId }).populate('courses');
        
            // Check if cart exists
            if (!cart) {
                return res.render('cart/getCart', { cart: null, totalPrice: 0 });
            }
    
            // Fetch course data for each course in the cart
            const courses = await Promise.all(cart.courses.map(async courseId => {
                const course = await Course.findById(courseId).populate({
                    path: 'instructors',
                    select: 'firstname lastname'
                });
                return course;
            }));
    
            const totalPrice = await cart.calculateTotalPrice();
            res.render('courses/viewEnrolledCourses', { cart, totalPrice, currentUser: req.user, enrolledCourses: user.enrolledCourses, courses })
        } catch (err) {
            res.status(500).json({ error: err.message })
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

    // Mark a course as completed for a User
    completeCourse: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const courseId = req.params.courseId;
    
            // Fetch the user
            const user = await User.findById(userId).populate('enrolledCourses');
            const course = await Course.findById(courseId);
    
            if (!user) {
                return res.status(404).json({ message: 'User Not Found' });
            }
    
            // Remove the course from the user's enrolled courses
            user.enrolledCourses = user.enrolledCourses.filter(id => id.toString() !== courseId.toString());
    
            // Also update the course to remove the student
            course.students = course.students.filter(id => id.toString() !== userId.toString());
    
            await Promise.all([user.save(), course.save()]);
    
            // Update enrollment limit
            if (course.enrollmentLimit) {
                course.enrollmentLimit++;
                await course.save();
            }
    
            res.status(200).json({ message: 'Course marked as completed', user, course });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    // Route to remove a student from a course
    removeStudentFromCourse: async (req, res, next) => {
        try {
        const courseId = req.params.courseId;
        const userId = req.params.userId;
    
        // Fetch the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
    
        // Fetch the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        // Remove the user from the course's students array
        course.students.pull(userId);
        await course.save();
    
        // Remove the course from the user's enrolledCourses array
        user.enrolledCourses.pull(courseId);
        await user.save();
    
        // Update the enrollment limit by incrementing it by 1
        if (course.enrollmentLimit) {
            course.enrollmentLimit++;
            await course.save();
        }
    
        res.redirect(`/admin/course/${courseId}`)
        } catch (err) {
        res.status(400).json({ error: err.message });
        }
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// INSTRUCTORS     ////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    renderInstructorDashboard: async (req, res) => {
        try {
            const userId = req.params.userId;
            // Fetch user information for the logged-in instructor
            const user = await User.findById(userId); // Assuming the instructorId is the user's _id
            // Fetch courses associated with the instructor
            const courses = await Course.find({ instructors: userId }).populate('instructors').populate('students');
    
            // Log the courses fetched
            console.log('Courses for instructor:', courses);
    
            if (courses.length === 0) {
                // If the instructor is not associated with any courses, render the dashboard with an empty courses array
                return res.render('instructors/dashboard', { user: req.user, courses: [] });
            }
            // Render the instructor dashboard template with course data
            res.render('instructors/dashboard', { user: req.user, courses });
        } catch (err) {
            console.error('Error rendering instructor dashboard:', err);
            res.status(500).send('Internal Server Error');
        }
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// STUDENTS     ////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    renderStudentDashboard: async (req, res) => {
        try {
            const userId = req.params.userId;
            
            // Fetch user information for the logged-in student
            const user = await User.findById(userId).populate('enrolledCourses');
    
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Fetch courses associated with the student
            const courses = await Course.find({ students: userId }).populate('instructors').populate('students');
    
            // Log the courses fetched
            //console.log('Courses for student:', courses);
            //console.log('User:', user)
    
            // Render the student dashboard template with course data
            res.render('students/dashboard', { user, courses });
        } catch (err) {
            console.error('Error rendering student dashboard:', err);
            res.status(500).send('Internal Server Error');
        }
    }
    

}
module.exports = userControllers