const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'myapp',
    password: 'Dany@789',
    port: 5432,
});

// Get a list of all patients
router.get('/patients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM patients ORDER BY token');
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Add a new patient
router.post('/patients', async (req, res) => {
    const { name, phone } = req.body;
    try {
        // Get the current highest token number
        const result = await pool.query('SELECT MAX(token) FROM patients');
        const currentToken = result.rows[0].max;
        // Generate a new token
        const newToken = String.fromCharCode(currentToken.charCodeAt(0) + 1) + (parseInt(currentToken.substr(2)) + 1).toString().padStart(3, '0');
        // Insert the new patient into the database
        await pool.query('INSERT INTO patients (name, phone, token) VALUES ($1, $2, $3)', [name, phone, newToken]);
        res.send(newToken);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Set the current token
router.put('/currentToken', async (req, res) => {
    const { token } = req.body;
    try {
        await pool.query('UPDATE current_token SET token = $1', [token]);
        res.send('Success');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Get the current token
router.get('/currentToken', async (req, res) => {
    try {
        const result = await pool.query('SELECT token FROM current_token');
        res.send(result.rows[0].token);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
