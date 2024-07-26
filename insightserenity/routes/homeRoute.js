const express = require('express');
const router = express.Router();
const homeControllers = require('../controllers/homeController');

router.route('/')
    .get(homeControllers.home)
router.route('/about')
    .get(homeControllers.about)
router.route('/team')
    .get(homeControllers.team)
router.route('/contact')
    .get(homeControllers.contact)
router.route('/terms')
    .get(homeControllers.terms)
router.route('/privacy')
    .get(homeControllers.privacy)

module.exports = router;