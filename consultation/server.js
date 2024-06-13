// Import required modules
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compression = require('compression');
const ejsMate = require('ejs-mate');
const cors = require('cors');
const morgan = require('morgan');

const User = require('./models/userModel');
const Consultant = require('./models/consultantModel');
const Client = require('./models/clientModel');

const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const consultantRoutes = require('./routes/consultantRoutes');

const dbUrl = process.env.DB_URL;

// Set up the database connection
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Service1 Database connected");
});

// Set up the view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({ secret: 'notagoodsecret', resave: false, saveUninitialized: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Session and flash
app.use(session({
    name: 'session',
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/client', clientRoutes);
app.use('/consultant', consultantRoutes);


module.exports = app; // Correctly export the app instance
