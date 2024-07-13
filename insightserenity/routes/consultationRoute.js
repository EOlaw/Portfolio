const express = require('express');
const router = express.Router();
const consultationControllers = require('../controllers/consultationController');
const { isAuthenticated, isAdmin, isClient, isConsultant } = require('../middleware/authMiddlewares');

// Consultation Routes
router.route('/create')
    .get(isAuthenticated, isClient, consultationControllers.renderConsultation)
    .post(isAuthenticated, isClient, consultationControllers.createConsultation)
router.route('/')
    .get(isAuthenticated, isClient, consultationControllers.getAllConsultations)

router.route('/:id')
    .get(isAuthenticated, consultationControllers.getConsultationById)
    .put(isAuthenticated, consultationControllers.updateConsultation)
    .delete(consultationControllers.deleteConsultation)

module.exports = router;