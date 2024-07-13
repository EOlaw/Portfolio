const express = require('express');
const router = express.Router();
const commentControllers = require('../controllers/commentController');
const { isAuthenticated, isAdmin, isClient, isConsultant } = require('../middleware/authMiddlewares');

// Routes for comments
router.route('/')
    .post(isAuthenticated, commentControllers.createComment)
    .put(isAuthenticated, commentControllers.updateComment)
router.route('/:consultationId')
    .post(isAuthenticated, commentControllers.getCommentsForConsultation)
router.route('/:commentId')
    .delete(isAuthenticated, commentControllers.deleteComment)

module.exports = router;
