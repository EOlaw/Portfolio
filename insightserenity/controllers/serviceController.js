const Service = require('../models/serviceModel');

const serviceController = {
    // Create a new service
    createService: async (req, res) => {
        try {
            const service = new Service(req.body);
            await service.save();
            res.status(201).json({ success: 'Service created successfully', service });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get all services
    getAllServices: async (req, res) => {
        try {
            const services = await Service.find();
            res.status(200).render('services/service', { services });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get a single service by ID
    getServiceById: async (req, res) => {
        try {
            const service = await Service.findById(req.params.id);
            if (!service) return res.status(404).json({ error: 'Service not found' });
            res.status(200).json({ service });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update a service
    updateService: async (req, res) => {
        try {
            const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!service) return res.status(404).json({ error: 'Service not found' });
            res.status(200).json({ success: 'Service updated successfully', service });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Delete a service
    deleteService: async (req, res) => {
        try {
            const service = await Service.findByIdAndDelete(req.params.id);
            if (!service) return res.status(404).json({ error: 'Service not found' });
            res.status(200).json({ success: 'Service deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = serviceController;
