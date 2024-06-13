const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
const { handleMongooseError } = require("../helpers/mongoose-error-handler");

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "email is required"],
            match: [
                /^\S+@\S+\.\S+$/,
                "the email address does not match the required format",
            ],
            unique: true,
        },
        password: {
            type: String,
            minlength: 6,
            required: [true, "password is required"],
        },

        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter",
        },
        token: {
            type: String,
            default: null,
        },
        avatarURL: {
            type: String,
            required: true,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, "Verify token is required"],
        },
    },
    { versionKey: false, timestamps: true, strict: true }
);

userSchema.post("save", handleMongooseError);
const User = mongoose.model("User", userSchema);

const authSchema = Joi.object({
    email: Joi.string()
        .pattern(/^\S+@\S+\.\S+$/)
        .required()
        .messages({
            "string.pattern.base":
                "The email address does not match the required format",
        }),
    password: Joi.string().min(6).required(),
})
    .max(2)
    .min(2);

const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
})
    .max(1)
    .min(1);

const verifyEmail = Joi.object({
    email: Joi.string()
        .pattern(/^\S+@\S+\.\S+$/)
        .required()
        .messages({
            "string.pattern.base":
                "The email address does not match the required format",
            "any.required": "Missing required field email",
        }),
})
    .max(1)
    .min(1);

const schemas = {
    authSchema,
    updateSubscriptionSchema,
    verifyEmail,
};

module.exports = { User, schemas };
