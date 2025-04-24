require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;


const dbConfig = {
    host: process.env.HOST || 'localhost',
    user: 'priyanshu_user',
    password: process.env.PASSWORD || '',
    database: process.env.DB_NAME || 'school_management'
};
console.log('Environment Variables:', {
    HOST: process.env.HOST,
    USER: process.env.USER,
    DB_NAME: process.env.DB_NAME,
    PORT: process.env.PORT
});
let pool;
async function initDb() {
    pool = mysql.createPool(dbConfig);
    console.log('Connected to MySQL database');
}

initDb().catch(
    err => {
        console.error('Database connection failed:', err);
    }
);
/*
let data;
async function initDb() {
    data = await mysql.createPool(dbConfig);  // Use the correct reference `data`
    console.log('Connected to MySQL database');
}

initDb().catch(err => {
    console.error('Database connection failed:', err);
});

*/

function calculateDistance(x1, y1, x2, y2) {
    const R = 6371;
    const dLat = (x2 - x1) * Math.PI / 180;
    const dLon = (y2 - y1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(x1 * Math.PI / 180) * Math.cos(x2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Add School API
app.post('/addSchool', async (req, res) => {
    try {
        const { name, address, latitude, longitude } = await req.body;

        // Validation
        if (!name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (typeof name !== 'string' || typeof address !== 'string') {
            return res.status(400).json({ error: 'Name and address must be strings' });
        }

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        connection.release();

        res.status(201).json({
            message: 'School added successfully',
            schoolId: result.insertId
        });
    } catch (error) {
        console.error('Error adding school:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;
    if (latitude == undefined || longitude == undefined) {
        return res.status(400).json({ error: "Parameters are reuired" });

    }
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (isNaN(userLon) || isNaN(userLat) || userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
        return res.status(400).json({ err: 'Invalid coordinates' })
    }

    const connection = await pool.getConnection();
    const [schools] = await connection.query('SELECT * FROM schools');

    connection.release();

    const schoolsDistance = schools.map(school => {
        const distance = calculateDistance(
            userLat, userLon, school.latitude, school.longitude)
        return {
            ...school,
            distance: parseFloat(distance.toFixed(2))
        };

    });
    schoolsDistance.sort((a, b) => a.distance - b.distance);
    res.json(schoolsDistance);

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;