const express = require('express');
const ImportSeason = require('../models/Season');
const router = express.Router();

const VALID_SEASONS = ['Winter', 'Spring', 'Summer', 'Autumn'];


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

router.delete('/:id', async (req, res) => {
    try {
        const season = await ImportSeason.findOneAndDelete({ id: Number(req.params.id) });
        if (!season) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Season with ID ${req.params.id} not found, and could not be deleted.`
            });
        }
        res.status(200).json({
            message: 'Season deleted successfully.',
        });
    } catch (err) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Request could not be processed due to an internal server error.'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.body.season === "Stay") {
            return res.status(200).json({
                message: 'It says stay, dad.',
                mood: "Docking Sequence",
                musicTag: "interstellar-soundtrack",
                illustrationTheme: "interstellar",
            });
        }

        if (!VALID_SEASONS.includes(req.body.season)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: `Season must be one of: ${VALID_SEASONS.join(', ')}.`
            });
        }

        const newSeason = new ImportSeason(req.body);
        await newSeason.save();
        res.status(201).json({
            message: 'Season created successfully.',
            data: newSeason
        });
    } catch (err) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Request could not be processed due to an internal server error.'
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (req.body.season !== undefined && !VALID_SEASONS.includes(req.body.season)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: `Season must be one of: ${VALID_SEASONS.join(', ')}.`
            });
        }
        
        const updatedSeason = await ImportSeason.findOneAndUpdate({ id: Number(req.params.id) }, req.body, { new: true });
        if (!updatedSeason) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Season with ID ${req.params.id} not found.`
            });
        }
        res.status(200).json({
            message: 'Season updated successfully.',
            data: updatedSeason
        });
    } catch (err) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Request could not be processed due to an internal server error.'
        })
    }
});



module.exports = router;