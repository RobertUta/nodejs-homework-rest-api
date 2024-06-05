const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const { contactsRouter } = require("./routes/contacts-router");
const { usersRouter } = require("./routes/users-router");

require("dotenv").config();
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "src", "public")));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((_req, res, _next) => {
    res.status(404).json({
        message: "Use api on routes: /api/contacts or /api/users",
    });
});

app.use((err, _req, res, _next) => {
    const { message, status } = err;

    res.status(status || 500).json({
        message: message,
    });
});

module.exports = { app };
