const Joi = require('@hapi/joi');

const matchValidator = (data) => {
    const schema = Joi.object({
        numberOfPlayers: Joi.number().valid(2, 4).required(),
        matchDate: Joi.date().required(),
        possiblePlaces: Joi.array().items(Joi.string()).required()
    });
    return schema.validate(data);
}

const scoreValidator = (data) => {
    const schema = Joi.object({
        sets: Joi.array().items({
            teamOne: Joi.number().valid(0, 1, 2, 3, 4, 5, 6, 7).required(),
            teamTwo: Joi.number().valid(0, 1, 2, 3, 4, 5, 6, 7).required(),
            teamOneTiebreak: Joi.number(),
            teamTwoTiebreak: Joi.number(),
        })
    });
    return schema.validate(data);
}

module.exports.matchValidator = matchValidator;
module.exports.scoreValidator = scoreValidator;