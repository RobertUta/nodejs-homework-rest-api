const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers/http-error-builder");
const { User } = require("../models/mongo-user-schema");

async function userAuthenticate(req, _res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.split(" ").length !== 2)
        next(new HttpError(401, "Not enough info in auth header"));

    const [tokenType, token] = authHeader.split(" ");

    if (tokenType !== "Bearer")
        next(new HttpError(401, "Token type is invalid"));

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        if (!mongoose.Types.ObjectId.isValid(_id))
            next(new HttpError(401, "Incorrect userId format in the token"));

        const currentUser = await User.findOne({ _id, token });
        if (!currentUser) next(new HttpError(401, "Not authorized"));

        req.user = currentUser;

        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError")
            next(new HttpError(401, "Invalid token"));

        if (err.name === "TokenExpiredError")
            next(new HttpError(401, "Token expired"));

        next(new HttpError(401, "Unknown token validation error occurred"));
    }
}

module.exports = { userAuthenticate };
