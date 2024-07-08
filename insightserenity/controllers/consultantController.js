const Consultant = require('../models/consultantModel');
const Consultation = require('../models/consultationModel');

const consultantControllers = {
    // Get Consultant Profile
    getConsultantProfile: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) return res.status(404).json({ error: 'Consultant profile not found' });
            res.status(200).json({ consultant });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Update Consultant Profile
    updateConsultantProfile: async (req, res) => {
        try {
            const consultant = await Consultant.findOneAndUpdate({ userId: req.user._id }, req.body, { new: true, runValidators: true });
            if (!consultant) return res.status(404).json({ error: 'Consultant profile not found' });
            res.status(200).json({ consultant });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Get Pending Consultations
    getPendingConsultations: async (req, res) => {
        try {
            const consultations = await Consultation.find({ consultantId: req.user._id, status: 'pending' });
            res.status(200).json({ consultations });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Get Approved Consultations
    getApprovedConsultations: async (req, res) => {
        try {
            const consultations = await Consultation.find({ consultantId: req.user._id, status: 'approved' });
            res.status(200).json({ consultations });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Get Canceled Consultations
    getCanceledConsultations: async (req, res) => {
        try {
            const consultations = await Consultation.find({ consultantId: req.user._id, status: 'canceled' });
            res.status(200).json({ consultations });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = consultantControllers;
