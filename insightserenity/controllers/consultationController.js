const Consultation = require('../models/consultationModel');
const Client = require('../models/clientModel');
const Consultant = require('../models/consultantModel');
const Service = require('../models/serviceModel');

const consultationController = {
    // Create a new consultation (handled by clientControllers)
    createConsultation: async (req, res) => {
        try {
            const { clientId, consultantId, serviceId, date, duration, mode, notes } = req.body;

            // Validate service exists
            const service = await Service.findById(serviceId);
            if (!service) return res.status(404).json({ error: 'Service not found' });

            const consultation = new Consultation({ clientId, consultantId, serviceId, date, duration, mode, notes });
            await consultation.save();
            res.status(201).json({ success: 'Consultation created successfully', consultation });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all consultations
    getAllConsultations: async (req, res) => {
        try {
            const consultations = await Consultation.find().populate('clientId consultantId serviceId');
            res.status(200).json({ consultations });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get a consultation by ID
    getConsultationById: async (req, res) => {
        try {
            const consultation = await Consultation.findById(req.params.id).populate('clientId consultantId serviceId');
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });
            res.status(200).json({ consultation });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update a consultation
    updateConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('clientId consultantId serviceId');
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });
            res.status(200).json({ success: 'Consultation updated successfully', consultation });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Delete a consultation
    deleteConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findByIdAndDelete(req.params.id);
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });
            res.status(200).json({ success: 'Consultation deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Approve a consultation request
    approveConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

            consultation.status = 'approved';
            await consultation.save();
            res.status(200).json({ success: 'Consultation approved successfully', consultation });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Cancel a consultation
    cancelConsultation: async (req, res) => {
        try {
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

            consultation.status = 'canceled';
            await consultation.save();
            res.status(200).json({ success: 'Consultation canceled successfully', consultation });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Reschedule a consultation
    rescheduleConsultation: async (req, res) => {
        try {
            const { date } = req.body;
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

            consultation.date = date;
            consultation.status = 'pending'; // Set status back to pending for rescheduling
            await consultation.save();
            res.status(200).json({ success: 'Consultation rescheduled successfully', consultation });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Add ratings
    addRating: async (req, res) => {
        try {
            const { rating, comments } = req.body;
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

            consultation.ratings.push({ client: req.user._id, rating, comments });
            await consultation.save();
            res.status(200).json({ success: 'Rating added successfully', consultation });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update rating
    updateRating: async (req, res) => {
        try {
            const { rating, comments } = req.body;
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

            const userRating = consultation.ratings.find(r => r.client.toString() === req.user._id.toString());
            if (!userRating) return res.status(404).json({ error: 'Rating not found' });

            userRating.rating = rating;
            userRating.comments = comments;
            await consultation.save();
            res.status(200).json({ success: 'Rating updated successfully', consultation });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all pending consultations (for consultants to review)
    getAllPendingConsultations: async (req, res) => {
        try {
            const consultations = await Consultation.find({ status: 'pending', consultantId: req.user._id }).populate('clientId consultantId serviceId');
            res.status(200).json({ consultations });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all approved consultations (for consultants to review)
    getAllApprovedConsultations: async (req, res) => {
        try {
            const consultations = await Consultation.find({ status: 'approved', consultantId: req.user._id }).populate('clientId consultantId serviceId');
            res.status(200).json({ consultations });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all canceled consultations (for consultants to review)
    getAllCanceledConsultations: async (req, res) => {
        try {
            const consultations = await Consultation.find({ status: 'canceled', consultantId: req.user._id }).populate('clientId consultantId serviceId');
            res.status(200).json({ consultations });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } 
};
    
module.exports = consultationController;
    
