
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
// app.use(cors());

// Serve static files and mount sub-services
const portfolio = require('./portfolios/server');
const insightserenity = require('./insightserenity/server');
// const university = require('./university/server')
const telecom = require('./telecom-churn-analysis/server')

app.use('/portfolios/public', express.static(path.join(__dirname, 'portfolios/public')));
app.use('/insightserenity/public', express.static(path.join(__dirname, 'insightserenity/public')));
// app.use('/university/public', express.static(path.join(__dirname, 'university/public')));
app.use('/telecom-churn-analysis/public', express.static(path.join(__dirname, 'telecom-churn-analysis/public')));


// Use sub-services
app.use('/', portfolio);
app.use('/insightserenity', insightserenity);
// app.use('/university', university);
app.use('/telecom', telecom);

port = 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
