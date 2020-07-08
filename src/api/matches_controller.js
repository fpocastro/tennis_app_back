const router = require('express').Router();
const verify = require('../helpers/verify_token');
const matchesService = require('../services/matches_service');
const {
    matchValidator,
    scoreValidator
} = require('../validators/matches_validator');

router.get('/', verify, async (req, res) => {
    try {
        filters = {};
        // filters.private = false;
        if (req.query.matchDate) filters.matchDate = {
            $gte: Date.parse(req.query.matchDate)
        }
        if (req.query.status) filters.status = req.query.status;
        if (req.query.numberOfPlayers) filters.numberOfPlayers = req.query.numberOfPlayers;
        if (req.query.possiblePlaces) filters.possiblePlaces = {
            $in: req.query.possiblePlaces.split(',')
        };
        if (req.query.creator) filters.creator = req.query.creator;
        if (req.query.user) filters.$or = [{teamOne: {$in: [req.query.user]}}, {teamTwo: {$in: [req.query.user]}}]

        if (req.query.latLng) var latLng = req.query.latLng.split(',');

        matches = await matchesService.getMatchesByDistance(filters, latLng, req.query.maxDistance);

        res.send(matches);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/player/:_id', verify, async (req, res) => {
    try {
        var performance = await matchesService.getPlayerPerformance(req.params._id);

        res.send(performance);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post('/', verify, async (req, res) => {

    const {
        error
    } = matchValidator(req.body);
    if (error) return res.status(400).send({
        error: error.details[0]
    });

    try {
        const match = {
            creator: req.user._id,
            numberOfPlayers: req.body.numberOfPlayers,
            teamOne: [req.user._id],
            matchDate: req.body.matchDate,
            possiblePlaces: req.body.possiblePlaces
        };
        var savedMatch = await matchesService.createMatch(match);
        res.send(savedMatch);
    } catch (err) {
        res.status(500).send({
            error: {
                message: err
            }
        });
    }
});

router.put('/:_id/join/:team', verify, async (req, res) => {
    try {
        const matchId = req.params._id;
        const team = parseInt(req.params.team);
        const status = await matchesService.addPlayerToMatch(matchId, req.user._id, team);
        status ? res.send() : res.status(401).send(err);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:_id/score', verify, async (req, res) => {
    const {
        error
    } = scoreValidator(req.body);
    if (error) return res.status(400).send({
        error: error.details[0]
    });
    try {
        const matchId = req.params._id;
        const score = req.body;
        console.log(matchId)
        const status = await matchesService.updateScore(matchId, score, req.user._id);
        status ? res.send() : res.status(401).send(err);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:_id/quit', verify, async (req, res) => {
    try {
        const matchId = req.params._id;
        const status = await matchesService.removePlayerFromMatch(matchId, req.user._id);
        status ? res.send() : res.status(401).send(err);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/:_id', verify, async (req, res) => {
    try {
        var match = await matchesService.deleteMatch(req.params._id, req.user._id);
        res.send(match);
    } catch (err) {
        res.status(500).send({
            error: {
                message: err
            }
        });
    }
});

module.exports = router;