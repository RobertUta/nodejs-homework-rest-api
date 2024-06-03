const service = require("../../models/contacts/db-access-service");
const express = require("express");
const router = express.Router();
const { commonHandler } = require("./helpers");
const {
    contactCreateSchema,
    updateContactSchema,
    updateFavoriteSchema,
} = require("../../validators/contacts-validator");

router.get(
    "/contacts",
    commonHandler(async (_req, res, _next) => {
        const contacts = await service.listContacts();
        res.status(200).json(contacts);
    })
);

router.get(
    "/contacts/:id",
    commonHandler(async (req, res, _next) => {
        const contact = await service.getContactById(req.params.id);
        if (!contact)
            return res.status(404).json({
                message: `No contact found with this ID: ${req.params.id}`,
            });

        return res.status(200).json(contact);
    })
);

router.post(
    "/contacts",
    commonHandler(async (req, res, _next) => {
        const { error } = contactCreateSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const contact = await service.addContact(req.body);
        res.status(201).json(contact);
    })
);

router.patch(
    "/contacts/:id",
    commonHandler(async (req, res, _next) => {
        const { error } = updateContactSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const contact = await service.updateContact(req.params.id, req.body);
        if (!contact)
            return res.status(404).json({
                message: `No contact found with this ID: ${req.params.id}`,
            });

        return res.status(200).json(contact);
    })
);

router.patch(
    "/contacts/:id/favorite",
    commonHandler(async (req, res, _next) => {
        const { error } = updateFavoriteSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const contact = await service.updateContact(req.params.id, req.body);
        if (!contact)
            return res.status(404).json({
                message: `No contact found with this ID: ${req.params.id}`,
            });

        return res.status(200).json(contact);
    })
);

router.delete(
    "/contacts/:id",
    commonHandler(async (req, res, _next) => {
        const contact = await service.removeContact(req.params.id);
        if (!contact)
            return res.status(404).json({
                message: `No contact found with this ID: ${req.params.id}`,
            });

        return res.status(200).json(contact);
    })
);

module.exports = router;
