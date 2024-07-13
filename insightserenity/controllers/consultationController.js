const Consultation = require('../models/consultationModel');
const Client = require('../models/clientModel');
const Consultant = require('../models/consultantModel');
const Service = require('../models/serviceModel');

const consultationController = {
    renderConsultation: async (req, res) => {
        try {
            const services = await Service.find(); // Fetch all services from your database
            const consultantSpecializations = await Consultant.distinct('specializations'); // Adjust this as per your Consultant model
            res.render('consultations/create', { 
                services,
                specializations: consultantSpecializations
             }); // Pass services to the EJS template
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Create a new consultation (handled by clientControllers)
    createConsultation: async (req, res) => {
        try {
            const { serviceId, date, duration, mode, notes, specializations } = req.body;
    
            // Ensure the client is logged in and retrieve their ID
            const userId = req.user._id;
            console.log('Logged in User ID:', userId);
    
            // Retrieve client profile using userId
            const client = await Client.findOne({ userId });
            if (!client) {
                return res.status(404).json({ error: 'Client profile not found' });
            }
            const clientId = client._id;
            console.log('Client ID:', clientId);
    
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
    
            if (!consultant) {
                return res.status(404).json({ error: 'No available consultant with the requested specialization(s) found' });
            }
    
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
                serviceId,
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
    
    

    // Get all consultations
    getAllConsultations: async (req, res) => {
        try {
            const consultations = await Consultation.find().populate('clientId consultantId serviceId');
            console.log('Consultations:', consultations); // Add this line to inspect consultations
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
    }
};
    
module.exports = consultationController;
    
