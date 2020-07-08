const Joi = require('@hapi/joi');

const eventValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        place: Joi.string().required()
    });
    return schema.validate(data);
}

const eventGroupValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required()
    });
    return schema.validate(data);
}

const eventMatchValidator = (data) => {
    const schema = Joi.object({
        numberOfPlayers: Joi.number().valid(2, 4).required(),
        matchDate: Joi.date().required(),
        players: Joi.array().items(Joi.string()).required(),
        place: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports.eventValidator = eventValidator;
module.exports.eventGroupValidator = eventGroupValidator;
module.exports.eventMatchValidator = eventMatchValidator;