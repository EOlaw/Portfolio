const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeController');

router.route('/')
    .get(homeControllers.home)
router.route('/about')
    .get(homeControllers.about)
router.route('/portfolio')
    .get(homeControllers.portfolio)
router.route('/team')
    .get(homeControllers.team)
router.route('/contact')
    .get(homeControllers.contact)

module.exports = router;