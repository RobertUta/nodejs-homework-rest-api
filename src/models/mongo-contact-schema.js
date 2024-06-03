const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
const { handleMongooseError } = require("../helpers/mongoose-error-handler");

const contactSchema = new Schema(
    {
        name: {
            type: String,
            match: [
                /^[a-zA-Z]+ [a-zA-Z]+$/,
                "the name does not match the required format",
            ],
            required: true,
        },
        email: {
            type: String,
            match: [
                /^\S+@\S+\.\S+$/,
                "the email address does not match the required format",
            ],
            unique: true,
            required: true,
        },
        phone: {
            type: String,
            match: [
                /^(\+)?(38)?([0-9]{10})$/,
                "the phone number does not match the required format",
            ],
            required: true,
        },
        favorite: {
            type: Boolean,
            required: true,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { versionKey: false, timestamps: true, strict: true }
);

contactSchema.post("save", handleMongooseError);
const Contact = mongoose.model("Contact", contactSchema);

const createContactSchema = Joi.object({
    name: Joi.string()
        .pattern(/^[a-zA-Z]+ [a-zA-Z]+$/)
        .required()
        .messages({
            "string.pattern.base":
                "The name does not match the required format",
        }),
    email: Joi.string()
        .pattern(/^\S+@\S+\.\S+$/)
        .required()
        .messages({
            "string.pattern.base":
                "The email address does not match the required format",
        }),
    phone: Joi.string()
        .pattern(/^(\+)?(38)?([0-9]{10})$/)
        .required()
        .messages({
            "string.pattern.base":
                "The phone number does not match the required format",
        }),
    favorite: Joi.boolean(),
})
    .max(4)
    .min(3);

const updateContactSchema = Joi.object({
    name: Joi.string()
        .pattern(/^[a-zA-Z]+ [a-zA-Z]+$/)
        .messages({
            "string.pattern.base":
                "The name does not match the required format",
        }),
    email: Joi.string()
        .pattern(/^\S+@\S+\.\S+$/)
        .messages({
            "string.pattern.base":
                "The email address does not match the required format",
        }),
    phone: Joi.string()
        .pattern(/^(\+)?(38)?([0-9]{10})$/)
        .messages({
            "string.pattern.base":
                "The phone number does not match the required format",
        }),
})
    .max(3)
    .min(1);

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
})
    .max(1)
    .min(1);

const schemas = {
    createContactSchema,
    updateContactSchema,
    updateFavoriteSchema,
};

module.exports = { Contact, schemas };
