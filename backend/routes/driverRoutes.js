const express = require('express');
const Driver = require('../models/User'); // Assuming drivers are in Users table

const router = express.Router();

// Update driver GPS
router.put('/location/:driverId', async (req, res) => {
    const { driverId } = req.params;
    const { lat, lng } = req.body;
    try {
        const driver = await Driver.findByPk(driverId);
        if (!driver) return res.status(404).json({ error: 'Driver not found' });

        driver.current_lat = lat;
        driver.current_lng = lng;
        await driver.save();
        res.json({ message: 'Location updated', driver });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
