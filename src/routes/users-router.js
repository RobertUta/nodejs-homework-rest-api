const express = require("express");
const ctrl = require("../controllers/users-controllers");
const validateRequestBody = require("../middleware/request-body-validator");
const { schemas } = require("../models/mongo-user-schema");
const { userAuthenticate } = require("../middleware/user-authenticate");

const router = express.Router();

router.post(
    "/register",
    validateRequestBody(schemas.authSchema),
    ctrl.register
);
router.post("/login", validateRequestBody(schemas.authSchema), ctrl.login);
router.post("/current", userAuthenticate, ctrl.getCurrent);
router.post("/logout", userAuthenticate, ctrl.logout);
router.patch(
    "/",
    userAuthenticate,
    validateRequestBody(schemas.updateSubscriptionSchema),
    ctrl.updateSubscription
);

module.exports = { usersRouter: router };
