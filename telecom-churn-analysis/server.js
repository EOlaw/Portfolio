const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const { PythonShell } = require('python-shell');

// Set up the view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Path to your Python 3 executable
const pythonPath = '/Users/eolawale/opt/anaconda3/bin/python3';

// Function to run Python script and retrieve results
function runPythonScript(action, callback) {
    const options = {
        pythonPath: pythonPath
    };

    console.log("Received request for /eda");
    PythonShell.run(path.join(__dirname, 'scripts', 'analysis.py'), { args: ['eda'], ...options }, (err, results) => {
        if (err) {
            console.error("Error executing Python script:", err);
            callback(err); // Pass the error to the callback function
        } else {
            console.log("Python script executed successfully");
            const data = JSON.parse(results[0]);
            console.log("Data:", data);
            callback(null, data); // Pass the data to the callback function
        }
    });
}

app.get('/', async (req, res) => {
    // Call the Python script with 'eda' action
    runPythonScript('eda', (err, data) => {
        if (err) {
            // Handle error
            res.status(500).send('Error occurred while processing data');
        } else {
            // Render index.ejs with data
            res.render('index', { data });
        }
    });
});



module.exports = app;

