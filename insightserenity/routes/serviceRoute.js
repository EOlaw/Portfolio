const express = require('express');
const router = express.Router();
const serviceControllers = require('../controllers/serviceController');
const { isAuthenticated, isAdmin, isClient, isConsultant } = require('../middleware/authMiddlewares');

// Service Routes
router.route('/')
    .post(serviceControllers.createService)
    .get(serviceControllers.getAllServices)

router.route('/:id')
    .get(serviceControllers.getServiceById)
    .put(serviceControllers.updateService)
    .delete(serviceControllers.deleteService)

module.exports = router;