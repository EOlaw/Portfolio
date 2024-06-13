const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeControllers');

router.route('/')
    .get(homeControllers.homepage)
router.route('/cofounder')
    .get(homeControllers.cofounder)
router.route('/about')
    .get(homeControllers.about)
router.route('/team')
    .get(homeControllers.team)
router.route('/services')
    .get(homeControllers.services)
router.route('/portfolio')
    .get(homeControllers.portfolio)
router.route('/portfolio-details')
    .get(homeControllers.portfolioDetails)
router.route('/contact')
    .get(homeControllers.contact)

module.exports = router