const router = require('express').Router();
const verify = require('../helpers/verify_token');
const eventsService = require('../services/events_service');
const {
    eventValidator,
    eventGroupValidator,
    eventMatchValidator
} = require('../validators/events_validator');
const usersService = require('../services/users_service');

router.get('/', verify, async (req, res) => {
    try {
        events = req.query.searchBy === 'participant' ? await eventsService.getEventsByParticipant(req.user._id) : await eventsService.getEventsByCreator(req.user._id);

        res.send(events);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/:_id', verify, async (req, res) => {
    try {
        event = await eventsService.getEvent(req.params._id);

        if (event.creator !== req.user._id && !event.participants.includes(req.user._id)) return res.status(401).send({
            error: {
                message: 'User not allowed to execute this operation'
            }
        });

        res.send(event);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/', verify, async (req, res) => {

    const {
        error
    } = eventValidator(req.body);
    if (error) return res.status(400).send({
        error: error.details[0]
    });

    try {
        const event = {
            creator: req.user._id,
            name: req.body.name,
            place: req.body.place,
        };
        var savedEvent = await eventsService.createEvent(event);
        res.send(savedEvent);
    } catch (err) {
        res.status(500).send({
            error: {
                message: err
            }
        });
    }
});

router.put('/:_id/add_participant/:uid', verify, async (req, res) => {
    try {

        user = await usersService.getUser(req.params.uid);
        if (!user) return res.status(404).send({
            error: 'User not found.'
        });

        event = await eventsService.addParticipant(req.params._id, req.user._id, req.params.uid);

        res.send(event);
    } catch (err) {
        res.status(500).send({
            error: {
                message: err
            }
        });
    }
});

router.put('/:_id/add_group', verify, async (req, res) => {
    const {
        error
    } = eventGroupValidator(req.body);
    if (error) return res.status(400).send({
        error: error.details[0]
    });

    try {
        event = await eventsService.addGroup(req.params._id, req.body.name, req.user._id);

        res.send(event);
    } catch (err) {
        res.status(500).send({
            error: {
                message: err
            }
        });
    }
});

router.delete('/:_id/remove_group/:groupId', verify, async (req, res) => {
    try {
        event = await eventsService.removeGroup(req.params._id, req.params.groupId, req.user._id);

        res.send(event);
    } catch (err) {
        res.status(500).send({
            error: {
                message: err
            }
        });
    }
});

router.put('/:_id/group/:groupId/add_round', verify, async (req, res) => {
    const {
        error
    } = eventGroupValidator(req.body);
    if (error) return res.status(400).send({
        error: error.details[0]
    });

    try {
        eventId = await eventsService.addRound(req.params._id, req.params.groupId, req.body.name, req.user._id);

        res.send({
            eventId: eventId
        });
    } catch (err) {
        res.status(500).send({
            error: {
                message: err
            }
        });
    }
});

router.delete('/:_id/group/:groupId/round/:roundId', verify, async (req, res) => {
    try {
        event = await eventsService.removeRound(req.params.roundId, req.user._id);

        res.send(event);
    } catch (err) {
        res.status(500).send({
            error: {
                message: err
            }
        });
    }
});

router.post('/:_id/group/:groupId/round/:roundId/add_match', verify, async (req, res) => {
    const {
        error
    } = eventMatchValidator(req.body);
    if (error) return res.status(400).send({
        error: error.details[0]
    });

    try {
        var teamOne = [];
        var teamTwo = [];
        if (req.body.numberOfPlayers == 2) {
            teamOne = [req.body.players[0]]
            teamTwo = [req.body.players[1]]
        } else {
            teamOne = [req.body.players[0], req.body.players[1]]
            teamTwo = [req.body.players[2], req.body.players[3]]
        }


        const match = {
            creator: req.user._id,
            status: 'pending',
            private: true,
            numberOfPlayers: req.body.numberOfPlayers,
            teamOne: teamOne,
            teamTwo: teamTwo,
            matchDate: req.body.matchDate,
            possiblePlaces: req.body.place
        };

        savedMatch = await eventsService.addMatch(match, req.params.groupId, req.params.roundId, req.user._id);

        res.send(savedMatch);
    } catch (err) {
        console.log(err)
        res.status(500).send({
            error: {
                message: err
            }
        });
    }
});

router.delete('/:_id/group/:groupId/round/:roundId/match/:matchId', verify, async (req, res) => {
    try {
        event = await eventsService.removeMatch(req.params.roundId, req.params.matchId, req.user._id);

        res.send(event);
    } catch (err) {
        res.status(500).send({
            error: {
                message: err
            }
        });
    }
});

module.exports = router