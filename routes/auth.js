/** @format */

"use strict";
// auth.js

const express = require("express");
const Joi = require("joi");
const { responseObject, generateAccessToken } = require("../helpers");
const router = express.Router();
const User = require("../db/model/user.model");
const debug = process.env.NODE_ENV !== "production";
// const tokenSecret = process.env.TOKEN_SECRET;
const bcrypt = require("bcrypt");

const validators = {};
validators.login = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().pattern(/[0-9A-Z_$#*]gi/),
  }).with("email", "password");

  const { error } = schema.validate(req.body);
  if (Boolean(error)) next(error);
  next();
};
validators.register = (req, res, next) => {
  next();
};
validators.requestPasswordReset = (req, res, next) => {
  next();
};
validators.resetPassword = (req, res, next) => {
  next();
};
validators.confirmEmail = (req, res, next) => {
  next();
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });

    if (!user)
      return res
        .status(401)
        .json(responseObject(null, false, "User does not exist"));

    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res
        .status(400)
        .json(responseObject(null, false, "Invalid password"));
    const { password: dbPassword, ...otherFields } = user;
    // generate new token
    const token = generateAccessToken({ _id: user?._id, email: user?.email });
    res.status(200).json(
      responseObject(
        {
          ...otherFields,
          token,
        },
        true
      )
    );
  } catch (error) {
    debug && console.log({ error });
    res.statusCode = 422;
    next(new Error(`Unable to log in with ${JSON.stringify(req.body)}`));
  }
}

async function register(req, res, next) {
  try {
    const { email, username, password, re_password, ...rest } = req.body;
    // generate salt to hash password
    const user = new User({
      email,
      username,
      ...rest,
    });
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // set password to hashed string
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => res.status(201).json(responseObject(doc, true)));
  } catch (error) {
    debug && console.log({ error });
    res.statusCode = 422;
    next(new Error(`Unable to log in: ${req.params?.id}`));
  }
}

async function requestPasswordReset(req, res, next) {
  try {
  } catch (error) {
    debug && console.log({ error });
    res.statusCode = 422;
    next(new Error(`Unable to log in: ${req.params?.id}`));
  }
}

async function resetPassword(req, res, next) {
  try {
  } catch (error) {
    debug && console.log({ error });
    res.statusCode = 422;
    next(new Error(`Unable to log in: ${req.params?.id}`));
  }
}

async function confirmEmail(req, res, next) {
  try {
  } catch (error) {
    debug && console.log({ error });
    res.statusCode = 422;
    next(new Error(`Unable to log in: ${req.params?.id}`));
  }
}

router.post("/login", login);
/* router.post("/register", validators?.register, register);
router.post(
  "/requestPasswordReset",
  validators?.requestPasswordReset,
  requestPasswordReset
);
router.put("/resetPassword", validators?.resetPassword, resetPassword);
router.post("/confirmEmail", validators?.confirmEmail, confirmEmail); */
module.exports = router;
