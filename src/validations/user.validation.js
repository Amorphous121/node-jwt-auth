const Joi = require('joi');

exports.createUserValidation = {
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
}

exports.loginUserValiation = {
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
}