const router = require('express').Router();
const verify = require('../helpers/verify_token');
const chatsService = require('../services/chats_service');
const usersService = require('../services/users_service');

router.get('/', verify, async (req, res) => {
    try {
        chats = await chatsService.getChatsByUser(req.user._id);

        for (var i = 0; i < chats.length; i++) {
            var user = await usersService.getUser(chats[i].usersId.filter(e => e !== req.user._id)[0]);
            chats[i].user = user
        }

        res.send(chats);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/:_id', verify, async (req, res) => {
    try {
        chat = await chatsService.getChat([req.user._id, req.params._id]);
        
        if (!chat) {
            res.status(404).send({});
        }

        res.send(chat);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router