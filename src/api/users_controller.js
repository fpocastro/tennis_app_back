const router = require('express').Router();
const verify = require('../helpers/verify_token');
const usersService = require('../services/users_service');
const {
    userValidator
} = require('../validators/users_validator');
const cloud_storage = require('../helpers/cloud_storage');

router.get('/', verify, async (req, res) => {
    try {
        const latLng = req.query.latLng ? req.query.latLng.split(',') : null;
        users = await usersService.getUsers(latLng, parseInt(req.query.maxDistance));
        console.log(req.query.maxDistance);
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/:_id', verify, async (req, res) => {
    try {
        const user = await usersService.getUser(req.params._id);
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:_id', verify, async (req, res) => {
    const {
        error
    } = userValidator(req.body);
    if (error) return res.status(400).send({
        error: error.details[0]
    });

    if (req.params._id != req.user._id) return res.status(401).send({
        error: {
            message: 'User not allowed to execute this operation'
        }
    });

    try {
        const user = await usersService.updateUser(req.params._id, req.body);
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/upload_image/:_id', verify, async (req, res) => {
    if (req.params._id != req.user._id) return res.status(401).send({
        error: {
            message: 'User not allowed to execute this operation'
        }
    });
    try {
        const profile_image = req.body.picture.split(';base64,').pop();
        
        const imageUrl = await cloud_storage.uploadFile(req.params._id + '.png', profile_image, 'profiles');

        const user = await usersService.updateUser(req.params._id, {pictureUrl: imageUrl});

        res.send(user);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

module.exports = router