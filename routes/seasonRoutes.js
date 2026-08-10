const express = require('express');
const ImportSeason = require('../models/Season');
const router = express.Router();


router.get('/:id', async (req, res) => {
    try {
        const season = await ImportSeason.findOne({ id: Number(req.params.id) });
        if (!season) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Season with ID ${req.params.id} not found.`
            });
        }
        res.json({
            message: 'Season retrieved successfully.',
            data: season
        });
    } catch (err) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Request could not be processed due to an internal server error.'
        })
    }
});

module.exports = router;