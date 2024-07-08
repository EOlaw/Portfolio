const Client = require('../models/clientModel');
const Consultation = require('../models/consultationModel');

const clientControllers = {
    // Get Client Profile
    getClientProfile: async (req, res) => {
        try {
            const client = await Client.findOne({ userId: req.user._id });
            if (!client) return res.status(404).json({ error: 'Client profile not found' });
            res.status(200).json({ client });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = clientControllers;
