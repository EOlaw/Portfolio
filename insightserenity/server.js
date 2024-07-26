const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/userModel');
const Service = require('./models/serviceModel');
// const Consultant = require('./models/consultantModel');
// const Client = require('./models/clientModel');

const dbUrl = process.env.DB_URL_INSIGHTSERENITY || 'mongodb+srv://EOlaw146:Olawalee_.146@cluster0.4wv68hn.mongodb.net/InsightSerenity?retryWrites=true&w=majority';
const secret = process.env.SECRET || 'p2xv8BGCmMmIYN1UkFVfrVRZBxeYKr11vLZTfqEMwaE=';

const homeRoutes = require('./routes/homeRoute');
const userRoutes = require('./routes/userRoute');
const clientRoutes = require('./routes/clientRoute');
const consultantRoutes = require('./routes/consultantRoute');
const consultationRoutes = require('./routes/consultationRoute');
const serviceRoutes = require('./routes/serviceRoute');



// Set up the database connection
mongoose.connect(dbUrl);
const db = mongoose.connection;
// Check for database connection errors
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Set up the view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
// Clear EJS cache
app.set('view cache', false);
app.set('views', path.join(__dirname, 'views'));

// Set up middleware for parsing JSON and handling URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // This is for JSON data
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Set up session handling middleware
const sessionConfig = {
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async (req, res, next) => {
    const services = await Service.find().limit(6);
    res.locals.services = services;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Handle Routes
app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/client', clientRoutes);
app.use('/consultant', consultantRoutes);
app.use('/consultation', consultationRoutes);
app.use('/service', serviceRoutes);

// Handle Error Page
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404 ))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

module.exports = app;