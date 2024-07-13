const Consultant = require('../models/consultantModel');
const Consultation = require('../models/consultationModel');
const Service = require('../models/serviceModel');

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
    getConsultations: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) return res.status(404).json({ error: 'Consultant profile not found' });

            const consultations = await Consultation.find({ consultantId: consultant._id })
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

            res.status(200).json({ consultations });
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
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) {
                return res.status(404).json({ error: 'Consultant profile not found' });
            }

            const consultations = await Consultation.find({ consultantId: consultant._id, status: 'pending' })
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

            res.status(200).json({ consultations });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get Approved Consultations
    getApprovedConsultations: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) {
                return res.status(404).json({ error: 'Consultant profile not found' });
            }

            const consultations = await Consultation.find({ consultantId: consultant._id, status: 'approved' })
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

            res.status(200).json({ consultations });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get Canceled Consultations
    getCanceledConsultations: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) {
                return res.status(404).json({ error: 'Consultant profile not found' });
            }

            const consultations = await Consultation.find({ consultantId: consultant._id, status: 'canceled' })
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

            res.status(200).json({ consultations });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Approve a consultation request
    approveConsultation: async (req, res) => {
        try {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) {
                return res.status(403).json({ error: 'You are not authorized to perform this action' });
            }

            const consultation = await Consultation.findById(req.params.id);
            if (!consultation || consultation.consultantId.toString() !== consultant._id.toString()) {
                return res.status(404).json({ error: 'Consultation not found or you are not authorized to approve this consultation' });
            }

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
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) {
                return res.status(403).json({ error: 'You are not authorized to perform this action' });
            }

            const consultation = await Consultation.findById(req.params.id);
            if (!consultation || consultation.consultantId.toString() !== consultant._id.toString()) {
                return res.status(404).json({ error: 'Consultation not found or you are not authorized to cancel this consultation' });
            }

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
            const consultant = await Consultant.findOne({ userId: req.user._id });
            if (!consultant) {
                return res.status(403).json({ error: 'You are not authorized to perform this action' });
            }

            const { date } = req.body;
            const consultation = await Consultation.findById(req.params.id);
            if (!consultation || consultation.consultantId.toString() !== consultant._id.toString()) {
                return res.status(404).json({ error: 'Consultation not found or you are not authorized to reschedule this consultation' });
            }

            consultation.date = date;
            consultation.status = 'pending'; // Set status back to pending for rescheduling
            await consultation.save();
            res.status(200).json({ success: 'Consultation rescheduled successfully', consultation });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    };

module.exports = consultantControllers;
