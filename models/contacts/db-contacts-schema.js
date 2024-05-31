const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set("strictQuery", true);

const contactSchema = new Schema(
    {
        name: {
            type: String,
            match: /^[a-zA-Z]+ [a-zA-Z]+$/,
            required: true,
        },
        email: {
            type: String,
            match: /^\S+@\S+\.\S+$/,
            unique: true,
            required: true,
        },
        phone: {
            type: String,
            match: /^(\+)?(38)?([0-9]{10})$/,
            required: true,
        },
        favorite: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { versionKey: false, strict: "throw" }
);

const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;
