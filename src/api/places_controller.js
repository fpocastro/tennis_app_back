const router = require('express').Router();
const verify = require('../helpers/verify_token');
const {placeValidator} = require('../validators/places_validator');
const placesService = require('../services/places_service');

router.get('/', verify, async (req, res) => {
    try {
        const places = await placesService.getPlaces();
        res.send(places);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/distance/:latLng', verify, async (req, res) => {
    try {
        const latLng = req.params.latLng.split(',')
        const places = await placesService.getPlacesByDistance(latLng, 5000);
        res.send(places);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/:_id', verify, async (req, res) => {
    try {
        const place = await placesService.getPlace(req.params._id);
        res.send(place);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/', verify, async (req, res) => {
    const {error} = placeValidator(req.body);
    if (error) return res.status(400).send({error: error.details[0]});

    try {
        const place = await placesService.addPlace(req.body);
        res.send(place);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:_id', verify, async (req, res) => {
    const {error} = placeValidator(req.body);
    if (error) return res.status(400).send({error: error.details[0]});

    try {
        const place = await placesService.updatePlace(req.params._id, req.body);
        res.send(place);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;