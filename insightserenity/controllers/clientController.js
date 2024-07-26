const User = require('../models/userModel')
const Client = require('../models/clientModel');
const Consultant = require('../models/consultantModel');
const Consultation = require('../models/consultationModel');
const Service = require('../models/serviceModel');

const clientControllers = {
    /*
    // Get Client Profile
    getClientProfile: async (req, res) => {
        try {
            const client = await Client.findOne({ userId: req.user._id }).populate('userId')
            if (!client) return res.status(404).json({ error: 'Client profile not found' });
            const consultations = await Consultation.find({ clientId: client._id }).populate('serviceId')
            
            res.render('clients/profile', { client, consultations})
            // res.status(200).json({ client });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    */
    // Get Client Profile
    getClientProfile: async (req, res) => {
        try {
            const co = await Client.findOne({ userId: req.user._id }).populate('userId')
            if (!co) return res.status(404).json({ error: 'Client profile not found' });
            const consultations = await Consultation.find({ clientId: co._id }).populate('serviceId')
            
            res.render('clients/profile', { co, consultations})
            // res.status(200).json({ client });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    renderEditProfileForm: async (req, res) => {
        try {
            const co = await Client.findOne({ userId: req.user._id }).populate('userId');
            if (!co) return res.status(404).json({ error: 'Client profile not found' });
            res.status(200).render('clients/edit', { co });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Update Client Profile
    updateClientProfile: async (req, res) => {
        try {
            const { firstname, lastname, email, contactNumber, profilePicture, companyName, industry, contactPerson, address, website } = req.body;
    
            // Update User info
            const user = await User.findByIdAndUpdate(req.user._id, {
                firstname,
                lastname,
                email,
                contactNumber,
                profilePicture
            }, { new: true, runValidators: true });
    
            // Update Client profile
            const client = await Client.findOneAndUpdate({ userId: req.user._id }, {
                companyName,
                industry,
                contactPerson,
                address,
                website
            }, { new: true, runValidators: true });
    
            if (!user || !client) return res.status(404).json({ error: 'Profile not found' });
    
            res.status(200).redirect(`/insightserenity/client/`);
        } catch (error) {
            res.status(500).json({ error: error.message });
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
