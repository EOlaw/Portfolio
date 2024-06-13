// Import required modules
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const cors = require('cors');
const morgan = require('morgan');

const dbUrl = process.env.DB_URL;

// Set up the database connection
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Main Database connected");
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cors());


// Serve static files and mount sub-services
const portfolio = require('./portfolios/server');
const consultation = require('./consultation/server');

app.use('/portfolios/public', express.static(path.join(__dirname, 'portfolios/public')));
app.use('/consultation/public', express.static(path.join(__dirname, 'consultation/public')));

// Use sub-services
app.use('/', portfolio);
app.use('/consultation', consultation);

app.listen(3000, () => {
    console.log('Main server running on port 3000');
});
