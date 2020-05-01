const router = require('express').Router();
const verify = require('../helpers/verify_token');
const faqsService = require('../services/faqs_service');

router.get('/', verify, async (req, res) => {
    try {
        faqs = await faqsService.getFaqs();

        res.send(faqs);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router