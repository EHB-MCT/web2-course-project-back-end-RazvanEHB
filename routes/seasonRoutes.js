const express = require('express');
const ImportSeason = require('../models/Season');
const router = express.Router();
const { getPlaylistTracks } = require('../config/spotify');

const VALID_SEASONS = ['Winter', 'Spring', 'Summer', 'Autumn'];

function isMonthInSeason(month, season) {
    if (season.startMonth <= season.endMonth) {
        return month >= season.startMonth && month <= season.endMonth;
    } else {
        return month >= season.startMonth || month <= season.endMonth;
    }
}  

router.get('/current', async (req, res) => {
    try {

        const currentMonth = new Date().getMonth() + 1; // because JavaScript months are 0-indexed
        const seasons = await ImportSeason.find();
        const currentSeason = seasons.find(season => isMonthInSeason(currentMonth, season));
        
        if (!currentSeason) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Current season not found.'
            });
        } else {
            const tracks = await getPlaylistTracks(currentSeason.spotifyPlaylistId);
            res.status(200).json({
                message: 'Current season and tracks retrieved successfully.',
                data:{
                    ...currentSeason.toObject(),
                    tracks: tracks
                },
            });
        }

    } catch (err) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Request could not be processed due to an internal server error.'
        })
    }
});

router.get('/:id/tracks', async (req, res) => {
    try {
        const season = await ImportSeason.findOne({ id: Number(req.params.id) });
        
        if (season) {
            const tracks = await getPlaylistTracks(season.spotifyPlaylistId);
            res.status(200).json({
                message: 'Season tracks retrieved successfully.',
                data: tracks
            });
        } else {
            res.status(404).json({
                error: 'Not Found',
                message: `Season with ID ${req.params.id} not found.`
            });
        }
    } catch (err) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Request could not be processed due to an internal server error.'
        })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const season = await ImportSeason.findOne({ id: Number(req.params.id) });
        if (!season) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Season with ID ${req.params.id} not found.`
            });
        }
        res.status(200).json({
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
                spotifyPlaylistId: "4zO3S8u7pbKce09domQ7E0",
                message: 'It says stay, dad.',
                mood: "Docking Sequence",
                musicTag: "Interstellar Soundtrack",
                illustrationTheme: "Interstellar",
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

router.get ('/', async (req, res) => {
    try {
        const sortMap = {
            luminosity: { luminosityLevel: 1 },
            season: { startMonth: 1 },
            startMonth: { startMonth: 1 }
        };

        const sortOptions = sortMap[req.query.sortBy] || {};

        const filterOptions = {};
        if (req.query.filterByMood) {
            filterOptions.mood = req.query.filterByMood;
        }

        let seasons = await ImportSeason.find(filterOptions).sort(sortOptions);

        if (req.query.filterByMonth) {
            const monthNumber = Number(req.query.filterByMonth);
            seasons = seasons.filter(season => isMonthInSeason(monthNumber, season));
        }    

        res.status(200).json({
            message: 'Seasons retrieved successfully.',
            data: seasons
        });

    } catch (err) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Request could not be processed due to an internal server error.'
        })
    }
});



module.exports = router;