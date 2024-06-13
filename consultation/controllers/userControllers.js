const User = require('../models/userModel');
const Consultant = require('../models/consultantModel')
const Client = require('../models/clientModel')
const passport = require('passport');

const userControllers = {
    // Render Register Page
    renderRegister: (req, res) => {
        try {
            const user = req.user;
            if (user) return res.redirect('/');
            return res.status(200).render('user/register');
        } catch (err) {
            res.status(500).send(err);
        }
    },

    // Register User
    registerUser: async (req, res, next) => {
        try {
            const user = new User(req.body);
            await user.setPassword(req.body.password); //Use setPassword method provided by passport-local-mongoose to set the password
            await user.save();
            req.login(user, err => {
                if (err) return next(err);
                console.log(user)
                res.redirect('/');
            })
        } catch (err) {
            req.flash('error', err.message);
            console.log(err);
            res.redirect('/user/register')
        }
    },
    // Login Page
    renderLogin: (req, res) => {
        try {
            const user = req.user;
            if (user) return res.redirect('/user/login');
            return res.status(200).render('user/login')
        } catch (err) {
            res.status(500).json(err)
        }
    },

    // Login User
    loginUser: async (req, res, next) => {
        try {
            // Check the role of the user
            const user = req.user;
            if (user.role === 'consultant') {
                // Find the consultant associated with this user
                const consultant = await Consultant.findOne({ user: user._id });
                if (consultant) {
                    //req.flash('success', 'Welcome back, Consultant!');
                    return res.redirect(`/consultant/${consultant._id}`);
                }
            } else if (user.role === 'client') {
                // Find the client associated with this user
                const client = await Client.findOne({ user: user._id });
                if (client) {
                    //req.flash('success', 'Welcome back, Client!');
                    return res.redirect('/client');
                }
            }
        } catch (err) {
            console.error(err);
            req.flash('error', 'Something went wrong. Please try again.');
            res.redirect('/user/login');
        }
    },

    // Logout User
    logoutUser: (req, res) => {
        req.logout(err => {
            if (err) return next(err);
            //req.flash('success_msg', 'You are logged out');
            res.redirect('/user/login');
        });
    },

    // Render Dashboard
    getDashboard: async (req, res) => {
        const user = req.user;
        const consultant = await Consultant.findOne({ user: user._id });
        const client = await Client.findOne({ user: user._id });
        const role = req.user.role;
        if (role === 'client') {
            res.redirect(`/client/${client._id}`);
        } else if (role === 'consultant') {
            res.redirect(`/consultant/${consultant._id}`);
        } else {
            res.redirect('/');
        }
    },

    // Render User List
    getUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.render('user/list', { users });
        } catch (err) {
            res.status(500).send(err);
        }
    },

    // Delete User
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            req.flash('success_msg', 'User deleted successfully');
            res.redirect('/user/list');
        } catch (err) {
            res.status(500).send(err);
        }
    }
};

module.exports = userControllers;
