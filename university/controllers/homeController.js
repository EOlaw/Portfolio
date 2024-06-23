const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const Course = require('../models/courseModel');
const Announcement  = require('../models/announcementModel');
const Resource = require('../models/resourceModel');
const Document = require('../models/documentModel');
//const Administrator = require('../models/adminModels');


const homeController = {
    homepage: async (req, res) => {
        try {
            const courses = await Course.find().populate('instructors', 'firstname lastname')
            const courseTags = await Course.distinct("tags"); // Get all unique tags
            
            res.render('home/homepage', { courses: courses, courseTags: courseTags })
            //res.status(200).json({ courses: courses });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    about: (req, res, next) => {
        res.render('home/about')
    },
    contact: (req, res, next) => {
        res.render('home/contact')
    },
    resources: (req, res, next) => {
        res.render('home/resources')
    },
    faqs: (req, res, next) => {
        res.render('home/faqs')
    },
    privacy: (req, res, next) => {
        res.render('home/privacy')
    },
    terms: (req, res, next) => {
        res.render('home/terms')
    }
}

module.exports = homeController