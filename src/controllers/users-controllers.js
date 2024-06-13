const { nanoid } = require("nanoid");
const { HttpError } = require("../helpers/http-error-builder");
const { ctrlWrapper } = require("../helpers/controller-error-catcher");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/mongo-user-schema");
const Jimp = require("jimp");
const sgMail = require("@sendgrid/mail");

async function register(req, res, next) {
  const { email, password } = req.body;
  const verificationToken = nanoid(10);

  const user = await User.create({
    email,
    password: password
      ? await bcrypt.hash(password, 10)
      : next(new HttpError(401, "Password is required")),
    avatarURL: gravatar.url(email),
    verificationToken,
  });

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "roby10334@gmail.com",
    subject: "Please, confirm your email address",
    text: `Follow the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link </a>to confirm the email address`,
    html: `<h3>Follow the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link </a>to confirm the email address</h3>`,
  };
  await sgMail.send(msg);

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

  if (!user) throw new HttpError(401, `No registered user with email ${email}`);
  if (!user.verify)
    throw new HttpError(
      401,
      `The ${email} was not confirmed during registration! Please, confirm the email before login`
    );

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

async function getCurrent(req, res) {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
}

async function logout(req, res) {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { token: "" },
    { new: true, runValidators: true }
  );
  if (!user) throw new HttpError(401, "Not authorized");

  res.status(204).json({
    message: "No Content",
  });
}

async function updateSubscription(req, res) {
  const { subscription } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { subscription },
    { new: true, runValidators: true }
  );
  if (!updatedUser) throw new HttpError(401, "Not authorized");

  res.status(200).json({
    message: `Your subscription status has changed on "${subscription}"`,
  });
}

const avatarsDir = path.join(process.cwd(), "src", "public", "avatars");
async function updateAvatar(req, res, next) {
  const { _id } = req.user;
  const { originalname } = req.file;

  const tempUpload = path.join(process.cwd(), "src", "temp", originalname);
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  const avatar = await Jimp.read(tempUpload);
  avatar.resize(250, 250).write(tempUpload);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { avatarURL },
    { new: true, runValidators: true }
  );
  if (!updatedUser) throw new HttpError(401, "Not authorized");

  res.json({
    avatarURL,
  });
}

async function verifyToken(req, res, next) {
  const { verificationToken } = req.params;

  const user = await User.findOneAndUpdate(
    { verificationToken },
    { verify: true }
  );
  if (!user) throw new HttpError(404, "User not found");

  res.status(200).json({
    message: "Verification successful",
  });
}

async function verifyEmail(req, res, next) {
  const { email } = req.body;

  if (!email) throw new HttpError(400, "Missing required field email");

  const user = await User.findOne({ email });
  if (!user) throw new HttpError(404, "User not found");

  if (user.verify)
    throw new HttpError(400, "Verification has already been passed");

  const verificationToken = nanoid(10);
  await User.findOneAndUpdate({ email }, { verificationToken });

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "roby10334@gmail.com",
    subject: "Please, confirm your email address",
    text: `Follow the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link </a>to confirm the email address`,
    html: `<h3>Follow the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link </a>to confirm the email address</h3>`,
  };
  await sgMail.send(msg);

  res.status(200).json({
    message: "Verification email sent",
  });
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyToken: ctrlWrapper(verifyToken),
  verifyEmail: ctrlWrapper(verifyEmail),
};
