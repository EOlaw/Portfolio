const Consultation = require('../models/consultationModel');

const verifyConsultantOwnership = async (req, res, next) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation || consultation.consultantId.toString() !== req.user.consultantId.toString()) {
            return res.status(403).json({ error: 'You are not authorized to access this consultation' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = verifyConsultantOwnership;
