const express = require('express');
const cors = require('cors');
const path = require('path');

const nieuwsRoutes = require('./routes/nieuwsRoutes');
const spelersRoutes = require('./routes/spelersRoutes');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));


app.use('/api/nieuws', nieuwsRoutes);
app.use('/api/spelers', spelersRoutes);





app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint ERROR'
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'ERROR',
        error: err.message
    });
});

module.exports = app;