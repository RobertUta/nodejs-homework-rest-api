const mongoose = require("mongoose");

const makeMessage = (error) => {
    const messageTable = {
        name: "Invalid data type or format of 'name' field",
        email: "Invalid data type or format of 'email' field",
        phone: "Invalid data type or format of 'phone' field",
        favorite: "Invalid data type or format of 'favorite' field",
    };

    for (const keyword in messageTable) {
        if (error?.message.includes(keyword)) {
            return { message: messageTable[keyword] };
        }
    }

    return { message: error?.message };
};

const commonHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (e) {
        if (
            e instanceof mongoose.Error.ValidationError ||
            e instanceof mongoose.Error.StrictModeError ||
            e instanceof mongoose.Error.CastError
        ) {
            res.status(400).json(makeMessage(e));
        } else {
            next(e);
        }
    }
};

module.exports = { commonHandler };
