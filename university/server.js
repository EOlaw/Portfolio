// Import required modules
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const helmet = require('helmet')

const User = require('./models/userModel')
//Routes
const homeRoutes = require('./routes/homeRoute')
const userRoutes = require('./routes/userRoute')
const adminRoutes = require('./routes/adminRoutes')
//const cartRoutes = require('./routes/cartRoute')

const MongoDBStore = require('connect-mongo');
const dbUrl = process.env.DB_URL;

// Set up the database connection
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Service1 Database connected');
});

// Set up the view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cors());
app.use(compression());
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, 'public')));


const secret = process.env.SECRET || 'thishouldbeabettersecret'
// Create session store
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});
// Session and flash
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet({ contentSecurityPolicy: false }));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', homeRoutes)
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
//app.use('/cart', cartRoutes)

/* Route to handle form submission
app.post('/contact', (req, res) => {
    // Get form data from request body
    const { name, email, subject, message } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'oymosuemmanuel@gmail.com',
            pass: 'Olawalee_.146'
        }
    });

    // Email content
    const mailOptions = {
        from: email,
        to: 'oymosuemmanuel@gmail.com',
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('Error: Something went wrong');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Message sent successfully!');
        }
    });
});
*/


app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404 ))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

module.exports = app;