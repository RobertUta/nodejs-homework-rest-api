const Joi = require("joi");

const contactCreateSchema = Joi.object({
    name: Joi.string()
        .pattern(/^[a-zA-Z]+ [a-zA-Z]+$/)
        .required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
        .pattern(/^(\+)?(38)?([0-9]{10})$/)
        .required(),
    favorite: Joi.boolean(),
})
    .max(4)
    .min(3);

const updateContactSchema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z]+ [a-zA-Z]+$/),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^(\+)?(38)?([0-9]{10})$/),
})
    .max(3)
    .min(1);
// const updateContactSchema = Joi.object({
//     name: Joi.string().pattern(/^[a-zA-Z]+ [a-zA-Z]+$/),
//     email: Joi.string().email(),
//     phone: Joi.string().pattern(/^(\+)?(38)?([0-9]{10})$/),
//     favorite: Joi.boolean(),
// })
//     .max(4)
//     .min(1);

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
})
    .max(1)
    .min(1);

module.exports = {
    contactCreateSchema,
    updateContactSchema,
    updateFavoriteSchema,
};
