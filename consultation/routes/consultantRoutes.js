const express = require('express');
const router = express.Router();
const consultantControllers = require('../controllers/consultantControllers');
const { isAuthenticated, isConsultant } = require('../controllers/authControllers');

// Render form to create a new consultant profile
router.route('/new')
    .get(isAuthenticated, isConsultant, consultantControllers.renderCreateForm);
router.route('/')
    .post(isAuthenticated, isConsultant, consultantControllers.createConsultant)
    .get(isAuthenticated, isConsultant, consultantControllers.getConsultants)

// Render form to update a consultant profile by ID
router.route('/:id/edit')
    .get(isAuthenticated, isConsultant, consultantControllers.renderUpdateForm);

router.route('/:id')
    .get(isAuthenticated, isConsultant, consultantControllers.getConsultant)
    .put(isAuthenticated, isConsultant, consultantControllers.updateConsultant)
    .delete(isAuthenticated, isConsultant, consultantControllers.deleteConsultant)

module.exports = router;
