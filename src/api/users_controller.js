const router = require('express').Router();
const verify = require('../helpers/verify_token');
const usersService = require('../services/users_service');
const {userValidator} = require('../validators/users_validator');

router.get('/', verify, async (req, res) => {
    try {
        const user = await usersService.getUsers();
        res.send(user);
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
    const {error} = userValidator(req.body);
    if (error) return res.status(400).send({error: error.details[0]});

    if (req.params._id != req.user._id) return res.status(401).send({error: {message: 'User not allowed to execute this operation'}});

    try {
        const user = await usersService.updateUser(req.params._id, req.body);
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router