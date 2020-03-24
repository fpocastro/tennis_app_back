const Joi = require('@hapi/joi');

const registerValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
        name: Joi.string().min(6).max(255).required()
    });
    return schema.validate(data);
}

const loginValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(6).max(1024).required()
    });
    return schema.validate(data);
}

module.exports.registerValidator = registerValidator;
module.exports.loginValidator = loginValidator;