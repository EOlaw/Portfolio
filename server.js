const express = require('express');
const app = express();
const path = require('path');
//const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
//const session = require('express-session')
const flash = require('connect-flash')
//const ExpressError = require('./utils/ExpressError');
//const nodemailer = require('nodemailer');
const methodOverride = require('method-override')
//const passport = require('passport')
//const LocalStrategy = require('passport-local')
//const helmet = require('helmet')

// Set up the view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Set up middleware for parsing JSON and handling URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // This is for JSON data
app.use(methodOverride('_method'));
//app.use(session({ secret: 'notagoodsecret' }));
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('portfolio/homepage')
})

app.listen(4000, () => {
    console.log('listening on port 4000')
})