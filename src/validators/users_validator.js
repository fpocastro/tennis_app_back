const Joi = require('@hapi/joi');

const userValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).max(255).required(),
        dateOfBirth: Joi.date(),
        height: Joi.number(),
        weight: Joi.number(),
        laterality: Joi.string().valid('Destro', 'Canhoto'),
        backhand: Joi.string().valid('Uma mão', 'Duas mãos'),
        court: Joi.string().valid('Saibro', 'Rápida')
    });
    return schema.validate(data);
}

module.exports.userValidator = userValidator;