function handleMongooseError(error, _data, next) {
    const { name, code, message: originalMessage } = error;
    if (name === "MongoServerError" && code === 11000) {
        error.status = 409;
        error.message = originalMessage.includes("users")
            ? `A user with email ${error.keyValue.email} already exists`
            : `A contact with email ${error.keyValue.email} already exists`;
    }

    if (error?.name === "ValidationError") error.status = 400;
    next();
}

module.exports = { handleMongooseError };
