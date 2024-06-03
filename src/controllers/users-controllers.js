const { HttpError } = require("../helpers/http-error-builder");
const { ctrlWrapper } = require("../helpers/controller-error-catcher");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/mongo-user-schema");

async function register(req, res, next) {
    const { email, password } = req.body;

    const user = await User.create({
        email,
        password: password
            ? await bcrypt.hash(password, 10)
            : next(new HttpError(401, "Password is required")),
    });

    res.status(201).json({
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
}

async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
        throw new HttpError(401, `No registered user with email ${email}`);

    if (!(await bcrypt.compare(password, user.password)))
        throw new HttpError(401, "Wrong password");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "23h",
    });

    const recentUser = await User.findOneAndUpdate(
        { email },
        { token },
        {
            new: true,
        }
    );

    res.status(200).json({
        token: recentUser.token,
        user: {
            email: recentUser.email,
            subscription: recentUser.subscription,
        },
    });
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.status(200).json({
        email,
        subscription,
    });
};

const logout = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { token: true },
        { new: true, runValidators: true }
    );
    if (!user) throw new HttpError(401, "Not authorized");

    res.status(204).json({
        message: "No Content",
    });
};

const updateSubscription = async (req, res) => {
    const { subscription } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { subscription },
        { new: true, runValidators: true }
    );
    if (!user) throw new HttpError(401, "Not authorized");

    res.status(200).json({
        message: `Your subscription status has changed on "${subscription}"`,
    });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
};
