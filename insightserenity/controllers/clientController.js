const Client = require('../models/clientModel');
const Consultant = require('../models/consultantModel');
const Consultation = require('../models/consultationModel');
const Service = require('../models/serviceModel');

const clientControllers = {
    // Get Client Profile
    getClientProfile: async (req, res) => {
        try {
            const client = await Client.findOne({ userId: req.user._id });
            if (!client) return res.status(404).json({ error: 'Client profile not found' });
            res.render('clients/profile', { client })
            // res.status(200).json({ client });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Update Client Profile
    updateClientProfile: async (req, res) => {
        try {
            const client = await Client.findOneAndUpdate({ userId: req.user._id }, req.body, { new: true, runValidators: true });
            if (!client) return res.status(404).json({ error: 'Client profile not found' });
            res.status(200).json({ client });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Book a Consultation
    bookConsultation: async (req, res) => {
        try {
            const { serviceId, date, duration, mode, notes, specializations } = req.body;
            const clientId = req.user._id; // Ensure the user is logged in and get the client ID

            if (!specializations || specializations.length === 0) {
                return res.status(400).json({ error: 'Specializations must be provided' });
            }

            // Check if the service exists
            const service = await Service.findById(serviceId);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }

            // Find an available consultant with the required specializations
            const consultant = await Consultant.findOne({
                specializations: { $all: specializations },
                availability: true
            }).populate('userId');

            if (!consultant) return res.status(404).json({ error: 'No available consultant with the requested specialization(s) found' });

            // Check if the consultant is available at the specified date and time
            const overlappingConsultation = await Consultation.findOne({
                consultantId: consultant._id,
                date: { $lte: new Date(new Date(date).getTime() + duration * 60000) }, // End time
                endDate: { $gte: new Date(date) } // Start time
            });

            if (overlappingConsultation) {
                return res.status(409).json({ error: 'Consultant is not available at the requested time' });
            }

            // Create the consultation with the found consultant
            const consultation = new Consultation({
                clientId,
                consultantId: consultant._id,
                serviceId, // Include serviceId
                date,
                duration,
                mode,
                notes,
                status: 'pending'
            });

            await consultation.save();
            res.status(201).json({ success: 'Consultation created successfully', consultation });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Add Rating
    addRating: async (req, res) => {
        try {
            const { consultationId, rating, comments } = req.body;
            const consultation = await Consultation.findById(consultationId);
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

            consultation.ratings.push({
                client: req.user._id,
                rating,
                comments
            });

            await consultation.save();
            res.status(200).json({ consultation });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Update Rating
    updateRating: async (req, res) => {
        try {
            const { consultationId, ratingId, rating, comments } = req.body;
            const consultation = await Consultation.findById(consultationId);
            if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

            const ratingIndex = consultation.ratings.findIndex(r => r._id.toString() === ratingId);
            if (ratingIndex === -1) return res.status(404).json({ error: 'Rating not found' });

            consultation.ratings[ratingIndex] = { client: req.user._id, rating, comments };
            await consultation.save();
            res.status(200).json({ consultation });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = clientControllers;
