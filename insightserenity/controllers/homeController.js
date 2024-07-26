const Service = require('../models/serviceModel');

const homeController = {
    home: (req, res) => {
        res.render('home/main')
    },
    about: (req, res) => {
        res.render('home/about')
    },
    team: (req, res) => {
        res.render('home/team')
    },
    contact: (req, res) => {
        res.render('home/contact')
    },
    terms: (req, res) => {
        res.render('home/terms')
    },
    privacy: (req, res) => {
        res.render('home/privacy')
    }
}

module.exports = homeController