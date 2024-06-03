const { HttpError } = require("../helpers/http-error-builder");

const validateRequestBody = (schema) => {
    return function (req, _res, next) {
        const { error } = schema.validate(req.body);
        if (error) {
            next(new HttpError(400, error.message));
        }
        next();
    };
};

module.exports = validateRequestBody;
