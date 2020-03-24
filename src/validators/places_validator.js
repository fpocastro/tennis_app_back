const Joi = require('@hapi/joi');

const placeValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().max(255).required(),
        fullAddress: Joi.string().required(),
        geo: Joi.object().keys({
            type: Joi.string().required(),
            coordinates: Joi.array().required()
        }).required(),
        email: Joi.string().email().max(255),
        phone: Joi.string().max(16),
        website: Joi.string().max(1024),
        pictureUrl: Joi.string()
    });
    return schema.validate(data);
}

module.exports.placeValidator = placeValidator;