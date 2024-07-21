const User = require('../models/userModel');
const Consultant = require('../models/consultantModel');
const Consultation = require('../models/consultationModel');
const Service = require('../models/serviceModel');

const consultantControllers = {
    // Get Consultant Profile
    getConsultantProfile: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id }).populate('userId');
            if (!consultant) return res.status(404).render('error', { err: { message: 'Consultant profile not found', statusCode: 404 } });
            res.status(200).render('consultants/profile', { consultant });
        } catch (error) {
            res.status(500).render('error', { err: { message: error.message, statusCode: 500 } });
        }
    },

    // Get All Consultations with Filter
    getConsultations: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) {
                return res.status(404).render('error', { err: { message: 'Consultant profile not found', statusCode: 404 } });
            }

            const filter = { consultantId: consultant._id };
            if (req.query.status) {
                filter.status = req.query.status;
            }

            const consultations = await Consultation.find(filter)
                .populate({
                    path: 'clientId',
                    populate: {
                        path: 'userId',
                        model: 'User',
                        select: 'firstname lastname email'
                    },
                    select: 'companyName industry contactPerson'
                })
                .populate('serviceId', 'name description duration price');

            res.status(200).render('consultants/consultations', { consultations, status: req.query.status });
        } catch (error) {
            res.status(500).render('error', { err: { message: error.message, statusCode: 500 } });
        }
    },

    // Render Edit Profile Form
    renderEditProfileForm: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id }).populate('userId');
            if (!consultant) return res.status(404).json({ error: 'Consultant profile not found' });
            res.status(200).render('consultants/edit', { consultant });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update Consultant Profile
    updateConsultantProfile: async (req, res) => {
        try {
            const { firstname, lastname, email, contactNumber, profilePicture, specializations, experienceYears, bio, certifications, linkedInProfile, availability } = req.body;
    
            // Update User info
            const user = await User.findByIdAndUpdate(req.user._id, {
                firstname,
                lastname,
                email,
                contactNumber,
                profilePicture
            }, { new: true, runValidators: true });
    
            // Update Consultant profile
            const consultant = await Consultant.findOneAndUpdate({ userId: req.user._id }, {
                specializations: specializations.split(',').map(spec => spec.trim()),
                experienceYears,
                bio,
                certifications: certifications.split(',').map(cert => cert.trim()),
                linkedInProfile,
                availability: availability === 'true'
            }, { new: true, runValidators: true });
    
            if (!user || !consultant) return res.status(404).render('error', { err: { message: 'Profile not found', statusCode: 404 } });
    
            res.status(200).redirect(`/insightserenity/consultant/`);
        } catch (error) {
            res.status(500).render('error', { err: { message: error.message, statusCode: 500 } });
        }
    },

    // Render Consultations Dashboard
    renderConsultationsDashboard: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) return res.status(404).json({ error: 'Consultant profile not found' });

            const consultation = await Consultation.find({ consultantId: consultant._id })
                .populate({
                    path: 'clientId',
                    populate: {
                        path: 'userId',
                        model: 'User',
                        select: 'firstname lastname email'
                    },
                    select: 'companyName industry contactPerson'
                })
                .populate('serviceId', 'name description duration price');

            res.status(200).render('consultants/consultations', { consultation });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Render Consultation Details
    renderConsultationDetails: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) return res.status(404).json({ error: 'Consultant profile not found' });

            const consultation = await Consultation.findById(req.params.id)
                .populate({
                    path: 'clientId',
                    populate: {
                        path: 'userId',
                        model: 'User',
                        select: 'firstname lastname email'
                    },
                    select: 'companyName industry contactPerson'
                })
                .populate('serviceId', 'name description duration price');

            if (!consultation || consultation.consultantId.toString() !== consultant._id.toString()) {
                return res.status(404).json({ error: 'Consultation not found or you are not authorized to view this consultation' });
            }

            res.status(200).render('consultants/consultationDetails', { consultation });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Approve a Consultation Request
    approveConsultation: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) {
                return res.status(403).render('error', { err: { message: 'You are not authorized to perform this action', statusCode: 403 } });
            }

            const consultation = await Consultation.findById(req.params.id);
            if (!consultation || consultation.consultantId.toString() !== consultant._id.toString()) {
                return res.status(404).render('error', { err: { message: 'Consultation not found or you are not authorized to approve this consultation', statusCode: 404 } });
            }

            consultation.status = 'approved';
            await consultation.save();
            res.status(200).redirect(`/insightserenity/consultant/consultations/${consultation._id}`);
        } catch (err) {
            res.status(500).render('error', { err: { message: err.message, statusCode: 500 } });
        }
    },

    // Cancel a Consultation
    cancelConsultation: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) {
                return res.status(403).render('error', { err: { message: 'You are not authorized to perform this action', statusCode: 403 } });
            }

            const consultation = await Consultation.findById(req.params.id);
            if (!consultation || consultation.consultantId.toString() !== consultant._id.toString()) {
                return res.status(404).render('error', { err: { message: 'Consultation not found or you are not authorized to cancel this consultation', statusCode: 404 } });
            }

            consultation.status = 'canceled';
            await consultation.save();
            res.status(200).redirect(`/insightserenity/consultant/consultations/${consultation._id}`);
        } catch (err) {
            res.status(500).render('error', { err: { message: err.message, statusCode: 500 } });
        }
    },

    // Reschedule a Consultation
    rescheduleConsultation: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) {
                return res.status(403).render('error', { err: { message: 'You are not authorized to perform this action', statusCode: 403 } });
            }

            const { date } = req.body;
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation || consultation.consultantId.toString() !== consultant._id.toString()) {
                return res.status(404).render('error', { err: { message: 'Consultation not found or you are not authorized to reschedule this consultation', statusCode: 404 } });
            }

            consultation.date = date;
            consultation.status = 'pending'; // Set status back to pending for rescheduling
            await consultation.save();
            res.status(200).redirect(`/insightserenity/consultant/consultations/${consultation._id}`);
        } catch (err) {
            res.status(500).render('error', { err: { message: err.message, statusCode: 500 } });
        }
    }
};

module.exports = consultantControllers;
