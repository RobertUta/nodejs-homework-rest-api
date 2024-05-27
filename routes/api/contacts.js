const { listContacts } = require("../../models/contacts");
const { getContactById } = require("../../models/contacts");
const { addContact } = require("../../models/contacts");
const { removeContact } = require("../../models/contacts");
const { updateContact } = require("../../models/contacts");

const { contactCreateSchema } = require("../../validators/contactSchema");
const { updateContactSchema } = require("../../validators/contactSchema");

const express = require("express");
const contactsRouter = express.Router();

const commonHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

contactsRouter.get(
    "/",
    commonHandler(async (_req, res) => {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    })
);

contactsRouter.get(
    "/:contactId",
    commonHandler(async (req, res) => {
        const contactById = await getContactById(req.params.contactId);
        res.status(200).json(contactById);
    })
);

contactsRouter.post(
    "/",
    commonHandler(async (req, res) => {
        const { error } = contactCreateSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: "missing required name field" });
            return;
        }
        const newContact = await addContact(req.body);
        res.status(201).json(newContact);
    })
);

contactsRouter.delete(
    "/:contactId",
    commonHandler(async (req, res) => {
        await removeContact(req.params.contactId);
        res.status(200).json({ message: "contact deleted" });
    })
);

contactsRouter.patch(
    "/:contactId",
    commonHandler(async (req, res) => {
        const { error } = updateContactSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: "missing fields" });
            return;
        }
        const updatedContact = await updateContact(
            req.params.contactId,
            req.body
        );
        res.status(200).json(updatedContact);
    })
);

module.exports = { contactsRouter };
