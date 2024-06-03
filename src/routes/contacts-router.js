const express = require("express");
const ctrl = require("../controllers/contacts-controllers");
const validateRequestBody = require("../middleware/request-body-validator");
const { schemas } = require("../models/mongo-contact-schema");
const { userAuthenticate } = require("../middleware/user-authenticate");
const { isValidId } = require("../middleware/id-validator");

const router = express.Router();

router.get("/", userAuthenticate, ctrl.getAll);
router.get("/:id", isValidId, userAuthenticate, ctrl.getById);
router.post(
    "/",
    userAuthenticate,
    validateRequestBody(schemas.createContactSchema),
    ctrl.add
);
router.patch(
    "/:id",
    isValidId,
    userAuthenticate,
    validateRequestBody(schemas.updateContactSchema),
    ctrl.updateById
);
router.patch(
    "/:id/favorite",
    isValidId,
    userAuthenticate,
    validateRequestBody(schemas.updateFavoriteSchema),
    ctrl.updateFavorite
);
router.delete("/:id", isValidId, userAuthenticate, ctrl.deleteById);

module.exports = { contactsRouter: router };
