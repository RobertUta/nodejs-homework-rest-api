const Joi = require("joi");

const contactCreateSchema = Joi.object({
    name: Joi.string()
        .pattern(/^[a-zA-Z]+([ -][a-zA-Z]+)*$/)
        .required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
        .pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/)
        .required(),
}).max(3);

const updateContactSchema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z]+([ -][a-zA-Z]+)*$/),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/),
}).max(3);

module.exports = {
    contactCreateSchema,
    updateContactSchema,
};
