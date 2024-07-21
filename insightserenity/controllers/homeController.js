const Service = require('../models/serviceModel');

const homeController = {
    home: (req, res) => {
        res.render('home/main')
    },
    about: (req, res) => {
        res.render('home/about')
    },
    portfolio: (req, res) => {
        res.render('home/portfolio')
    },
    team: (req, res) => {
        res.render('home/team')
    },
    contact: (req, res) => {
        res.render('home/contact')
    }
}

module.exports = homeController