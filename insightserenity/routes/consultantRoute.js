const express = require('express');
const router = express.Router();
const consultantControllers = require('../controllers/consultantController');
const { isAuthenticated, isConsultant, isClient } = require('../middleware/authMiddlewares');

// Consultant Routes
// Render form to update a consultant profile by ID
router.route('/')
    .get(isAuthenticated, isConsultant, consultantControllers.getConsultantProfile)
router.route('/:id/edit')
    .get(isAuthenticated, isConsultant, consultantControllers.renderUpdateForm);
router.route('/update')
    .put(isAuthenticated, isConsultant, consultantControllers.updateConsultantProfile)
// Consultant Routes
router.route('/consultations')
    .get(isAuthenticated, isConsultant, consultantControllers.getConsultations);
router.route('/pending')
    .get(isAuthenticated, isConsultant, consultantControllers.getPendingConsultations)
router.route('/approved')
    .get(isAuthenticated, isConsultant, consultantControllers.getApprovedConsultations)
router.route('/canceled')
    .get(isAuthenticated, isConsultant, consultantControllers.getCanceledConsultations)
// Approve a consultation request
router.route('/:id/approve')
    .post(isAuthenticated, isConsultant, consultantControllers.approveConsultation);
// Cancel a consultation
router.route('/:id/cancel')
    .post(isAuthenticated, isConsultant, consultantControllers.cancelConsultation);
// Reschedule a consultation
router.route('/:id/reschedule')
    .post(isAuthenticated, isConsultant, consultantControllers.rescheduleConsultation);

module.exports = router;