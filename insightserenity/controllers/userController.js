const User = require('../models/userModel');
const Consultant = require('../models/consultantModel');
const Client = require('../models/clientModel');

const userControllers = {
    // Register Page
    renderRegister: (req, res) => {
        try {
            const user = req.user;
            if (user) return res.redirect('/');
            return res.status(200).render('users/register');
        } catch (err) {
            res.status(500).send(err);
        }
    },

    // Post Register
    registerUser: async (req, res, next) => {
        try {
            console.log('Request body:', req.body);
            const { firstname, lastname, email, role, contactNumber, profilePicture, username, password } = req.body;

            // Validate role
            if (!role || (role !== 'client' && role !== 'consultant')) {
                return res.status(400).json({ error: 'Invalid role specified' });
            }

            const user = new User({ firstname, lastname, email, role, contactNumber, profilePicture, username });
            await user.setPassword(password); // Use setPassword method provided by passport-local-mongoose to set the password
            await user.save();

            if (role === 'consultant') {
                const consultant = new Consultant({ userId: user._id });
                await consultant.save();
            } else if (role === 'client') {
                const client = new Client({ userId: user._id });
                await client.save();
            }

            req.login(user, err => {
                if (err) return next(err);
                console.log(user);
                res.redirect(`/insightserenity/user/${user._id}`);
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    },

    // Login Page
    renderLogin: (req, res) => {
        try {
            const user = req.user;
            if (user) return res.redirect('/insightserenity');
            return res.status(200).render('users/login');
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Post Login
    loginUser: async (req, res) => {
        try {
            const user = req.user;
            if (user.role === 'consultant') {
                const consultant = await Consultant.findOne({ userId: user._id });
                if (consultant) {
                    return res.redirect(`/insightserenity/consultant/`);
                }
            } else if (user.role === 'client') {
                const client = await Client.findOne({ userId: user._id });
                if (client) {
                    return res.redirect(`/insightserenity/user/${user._id}`);
                }
            }
            res.redirect('/insightserenity');
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong. Please try again.' });
        }
    },

    // Logout
    logout: (req, res) => {
        req.logout(err => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Logout failed. Please try again.' });
            }
            res.redirect('/insightserenity');
        });
    },

    // Get Users Profile
    getUsers: async (req, res) => {
        try {
            const users = await User.find();
            // res.status(200).json({ users });
            res.status(200).render('users/list', { users });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Get User Profile
    getUser: async (req, res) => {
        try {
            const userId = req.params.id;

            // Find the user in User model
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            let profile = { user };

            // Based on user's role, fetch corresponding profile from Client or Consultant model
            if (user.role === 'consultant') {
                const consultant = await Consultant.findOne({ userId });
                profile = { ...profile, consultant };
            } else if (user.role === 'client') {
                const client = await Client.findOne({ userId });
                profile = { ...profile, client };
            }
            //res.status(200).json(profile);
            res.status(200).render('users/profile', profile);
        } catch (error) {
            res.status(400).json({ error });
        }
    },

    // Update User Account
    updateUserAccount: async (req, res) => {
        try {
            const userId = req.params.id;
            const updateData = req.body;

            // Update user in User model
            const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
            if (!user) return res.status(404).json({ error: 'User not found' });

            let updatedProfile = { user };

            // If client or consultant data is updated, update it in respective models
            if (user.role === 'consultant') {
                await Consultant.findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true });
                const consultant = await Consultant.findOne({ userId });
                updatedProfile = { ...updatedProfile, consultant };
            } else if (user.role === 'client') {
                await Client.findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true });
                const client = await Client.findOne({ userId });
                updatedProfile = { ...updatedProfile, client };
            }

            res.redirect(`/user/${user._id}`);
        } catch (error) {
            res.status(400).json({ error });
        }
    },

    // Delete User Account
    deleteUserAccount: async (req, res) => {
        try {
            const userId = req.params.id;

            // Delete user from User model
            const user = await User.findByIdAndDelete(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            // Delete corresponding profile from Client or Consultant model
            if (user.role === 'consultant') {
                await Consultant.findOneAndDelete({ userId });
            } else if (user.role === 'client') {
                await Client.findOneAndDelete({ userId });
            }

            res.redirect('/users');
        } catch (error) {
            res.status(400).json({ error });
        }
    },
};

module.exports = userControllers;
