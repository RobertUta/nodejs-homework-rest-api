const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers/http-error-builder");

const isValidId = (req, _res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        next(new HttpError(400, `${id} is not valid id`));
    }
    next();
};

module.exports = { isValidId };
