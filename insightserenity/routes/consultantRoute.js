const express = require('express');
const router = express.Router();
const consultantControllers = require('../controllers/consultantController');
const { isAuthenticated, isConsultant } = require('../middleware/authMiddlewares');

// Consultant Routes
router.route('/')
    .get(isAuthenticated, isConsultant, consultantControllers.getConsultantProfile)

// Consultations Routes
router.route('/consultations')
    .get(isAuthenticated, isConsultant, consultantControllers.getConsultations);

router.route('/consultations/:id/approve')
    .post(isAuthenticated, isConsultant, consultantControllers.approveConsultation);

router.route('/consultations/:id/cancel')
    .post(isAuthenticated, isConsultant, consultantControllers.cancelConsultation);

router.route('/consultations/:id/reschedule')
    .post(isAuthenticated, isConsultant, consultantControllers.rescheduleConsultation);

// Render Edit Profile Form
router.route('/edit')
    .get(isAuthenticated, isConsultant, consultantControllers.renderEditProfileForm)
    .put(isAuthenticated, isConsultant, consultantControllers.updateConsultantProfile);

// Render Consultations Dashboard
router.get('/dashboard', isAuthenticated, isConsultant, consultantControllers.renderConsultationsDashboard);

// Render Consultation Details
router.get('/consultations/:id', isAuthenticated, isConsultant, consultantControllers.renderConsultationDetails);

module.exports = router;
