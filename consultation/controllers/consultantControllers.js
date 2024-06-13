const Consultant = require('../models/consultantModel');
const User = require('../models/userModel');

const consultantControllers = {
    // Render form to create a new consultant profile
    renderCreateForm: async (req, res) => {
        res.render('consultant/createConsultant');
    },

    // Create a new consultant profile
    createConsultant: async (req, res) => {
        try {
            const user = await User.findById(req.body.user);
            if (!user) return res.status(404).render('error', { message: 'User not found' });
            if (user.role !== 'consultant') return res.status(403).render('error', { message: 'Only users with the role of "Consultant" can create consultant profiles' });
            const consultant = new Consultant(req.body);
            await consultant.save();
            res.redirect(`/consultant/${consultant._id}`);
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    },

    // Get all consultant profiles
    getConsultants: async (req, res) => {
        try {
            const consultants = await Consultant.find().populate('user');
            //res.json({ message: 'Consultant', consultants })
            res.render('consultant/listConsultants', { consultants });
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    },

    // Get a consultant profile by ID
    getConsultant: async (req, res) => {
        try {
            const consultant = await Consultant.findById(req.params.id).populate('user');
            if (!consultant) return res.status(404).json('error', { message: 'Consultant profile not found' });
            const user = await User.findById(consultant.user);
            res.render('consultant/consultantProfile', { consultant: { ...consultant._doc, user } });
            //res.json({ message: 'Consultant', consultant })
            //res.render('consultant/viewConsultant', { consultant });
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    },

    // Render form to update a consultant profile by ID
    renderUpdateForm: async (req, res) => {
        try {
            const consultant = await Consultant.findById(req.params.id).populate('user');
            if (!consultant) return res.status(404).render('error', { message: 'Consultant profile not found' });
            res.render('consultant/updateConsultant', { consultant });
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    },

    // Update a consultant profile by ID
    updateConsultant: async (req, res) => {
        try {
            const consultant = await Consultant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('user');
            if (!consultant) return res.status(404).render('error', { message: 'Consultant profile not found' });
            res.redirect(`/consultant/${consultant._id}`);
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    },

    // Delete a consultant profile by ID
    deleteConsultant: async (req, res) => {
        try {
            const consultant = await Consultant.findByIdAndDelete(req.params.id);
            if (!consultant) return res.status(404).render('error', { message: 'Consultant profile not found' });
            res.redirect('/consultant');
        } catch (err) {
            res.status(400).render('error', { message: err.message });
        }
    }
};

module.exports = consultantControllers;

