const express = require('express');
const router = express.Router();
const exploreController = require('../controllers/exploreController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);

router.get('/', exploreController.getExploreContent);

module.exports = router;