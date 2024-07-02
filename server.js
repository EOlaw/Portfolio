
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const cors = require('cors');
const morgan = require('morgan');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cors());

// Serve static files and mount sub-services
const portfolio = require('./portfolios/server');
const consultation = require('./consultation/server');
const university = require('./university/server')
const telecom = require('./telecom-churn-analysis/server')

app.use('/portfolios/public', express.static(path.join(__dirname, 'portfolios/public')));
app.use('/consultation/public', express.static(path.join(__dirname, 'consultation/public')));
app.use('/university/public', express.static(path.join(__dirname, 'university/public')));
app.use('/telecom-churn-analysis/public', express.static(path.join(__dirname, 'telecom-churn-analysis/public')));


// Use sub-services
app.use('/', portfolio);
app.use('/consultation', consultation);
app.use('/university', university);
app.use('/telecom', telecom);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
