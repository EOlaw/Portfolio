// Example usage in a route
const express = require('express');
const router = express.Router();
const clientControllers = require('../controllers/clientControllers');
const { isAuthenticated, isClient } = require('../controllers/authControllers');

// Route to create a client
router.route('/new')
    .get(isAuthenticated, isClient, clientControllers.renderCreateForm)
router.route('/')
    .post(isAuthenticated, isClient, clientControllers.createClient)
    .get(isAuthenticated, isClient, clientControllers.getClients)
    
// Render form to update a consultant profile by ID
router.route('/:id/edit')
    .get(isAuthenticated, isClient, clientControllers.renderUpdateForm);

router.route('/:id')
    .get(isAuthenticated, isClient, clientControllers.getClient)
    .put(isAuthenticated, isClient, clientControllers.updateClient)
    .delete(isAuthenticated, isClient, clientControllers.deleteClient)

module.exports = router;