const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const { PythonShell } = require('python-shell');
const morgan = require('morgan');

// Set up the view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Path to your Python 3 executable
const pythonPath = '/Users/eolawale/opt/anaconda3/bin/python3';

function runPythonScript(scriptName, args, timeout = 60000) {
    return new Promise((resolve, reject) => {
        const options = {
            pythonPath: pythonPath,
            args: args
        };

        const pyshell = new PythonShell(path.join(__dirname, 'scripts', scriptName), options);

        let output = '';

        const timeoutId = setTimeout(() => {
            pyshell.terminate();
            reject(new Error('Script execution timed out'));
        }, timeout);

        pyshell.on('message', (message) => {
            output += message + '\n';
        });

        pyshell.on('error', (err) => {
            clearTimeout(timeoutId);
            reject(err);
        });

        pyshell.end((err) => {
            clearTimeout(timeoutId);
            if (err) reject(err);
            else {
                // Attempt to extract JSON from the output
                const jsonMatch = output.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    resolve(jsonMatch[0]);
                } else {
                    reject(new Error('No valid JSON found in Python script output'));
                }
            }
        });
    });
}

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/eda', async (req, res) => {
    try {
        const result = await runPythonScript('analysis.py', ['eda']);
        console.log('Raw Python script output:', result);
        let data;
        try {
            data = JSON.parse(result);
        } catch (parseError) {
            console.error('Error parsing Python script output:', parseError);
            console.error('Raw output:', result);
            throw new Error('Invalid JSON returned from Python script');
        }

        if (data.error) {
            console.error('Python script error:', data.error);
            throw new Error('Python script encountered an error');
        }

        res.render('eda', data);
    } catch (error) {
        console.error('Error in /eda route:', error);
        res.status(500).send('An error occurred while processing your request');
    }
});

app.get('/build_model', async (req, res) => {
    try {
        const result = await runPythonScript('analysis.py', ['build_model']);
        let data;
        try {
            data = JSON.parse(result);
        } catch (parseError) {
            console.error('Error parsing Python script output:', result);
            throw new Error('Invalid JSON returned from Python script');
        }

        if (data.error) {
            console.error('Python script error:', data.error);
            throw new Error('Python script encountered an error');
        }

        res.render('model', data);
    } catch (error) {
        console.error('Error in /build_model route:', error);
        res.status(500).send('An error occurred while processing your request');
    }
});

app.get('/visualize', async (req, res) => {
    try {
        const result = await runPythonScript('analysis.py', ['visualize']);
        let data;
        try {
            data = JSON.parse(result);
        } catch (parseError) {
            console.error('Error parsing Python script output:', result);
            throw new Error('Invalid JSON returned from Python script');
        }

        if (data.error) {
            console.error('Python script error:', data.error);
            throw new Error('Python script encountered an error');
        }

        res.render('visualize', data);
    } catch (error) {
        console.error('Error in /visualize route:', error);
        res.status(500).send('An error occurred while processing your request');
    }
});

module.exports = app;