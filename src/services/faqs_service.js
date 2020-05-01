const Faq = require('../models/Faq');

const getFaqs = async () => {
    var faqs = await Faq.find();

    return faqs;
}

module.exports.getFaqs = getFaqs;