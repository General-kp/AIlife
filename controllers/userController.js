const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const {
  generateOtp,
  generateResetToken,
  verifyResetToken,
  generateToken,
  sendMail,
} = require("../services/sessionHandler");

const SignUp = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    password: Joi.string().min(5).max(15).required(),
    userEmail: Joi.string().required(),
  });
  const result = schema.validate(req.body).error;
  if (result) {
    res.status(400);
    throw new Error(result.details[0].message);
  }
  try {
    const data = { ...req.body };
    const user = await User.findOne({ userEmail: data.userEmail });
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      const pass = bcrypt.hashSync(data.password, 10);
      const result = await User.create({
        userEmail: data.userEmail,
        password: pass,
      });
      if (!result) throw new Exception("Server error");
      else
        return res
          .status(200)
          .json({ message: "User registered", isNewUser: true });
    } else {
      return res
        .status(401)
        .json({ message: "User already exists", isNewUser: false });
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const Login = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    userEmail: Joi.string().required(),
  });
  const result = schema.validate(req.body).error;
  if (result) {
    res.status(400);
    throw new Error(result.details[0].message);
  }
  try {
    const data = { ...req.body };
    const user = await User.findOne({ userEmail: data.userEmail });
    if (!user) {
      return res
        .status(401)
        .json({ message: "login failed", status: "email doesnt exist" });
    } else {
      const res1 = bcrypt.compareSync(data.password, user.password);
      if (res1 == true) {
        const Token = generateToken(data.userEmail);
        return res
          .status(200)
          .json({
            message: "login successful",
            status: "loggedin",
            token: Token,
          });
      } else {
        return res
          .status(401)
          .json({ message: "login failed", status: "password doesnt match" });
      }
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const SendOtp = asyncHandler(async (req, res) => {
  if (!req.body.userEmail) {
    return res
      .status(400)
      .json({ message: "User email required", status: 400 });
  }
  try {
    const otp = generateOtp();
    const lastToken = generateResetToken(req.body.userEmail, otp);
    sendMail(req, res, {
      subject: "OTP to reset your Ailife account",
      message: `Your otp is ${otp}. Please don't share with anyone.`,
      token: lastToken,
    });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const VerifyOTP = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    otp: Joi.string()
      .min(6)
      .max(6)
      .pattern(/^[0-9]{6}$/)
      .required(),

    token: Joi.string().required(),

    userEmail: Joi.string().required(),
  });
  const result = schema.validate(req.body).error;
  if (result) {
    res.status(400);
    throw new Error(result.details[0].message);
  }

  try {
    const { userEmail, otp } = verifyResetToken(req.body.token);
    if (req.body.userEmail === userEmail && req.body.otp === otp) {
      return res.status(200).json({ message: "OTP verified", verified: true });
    } else
      return res
        .status(200)
        .json({ message: "OTP verification failed", verified: false });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});
const PasswordReset = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    password: Joi.string().min(5).max(15).required(),
    userEmail: Joi.string().required(),
  });
  const result = schema.validate(req.body).error;
  if (result) {
    res.status(400);
    throw new Error(result.details[0].message);
  }
  try {
    const data = { ...req.body };
    const pass = bcrypt.hashSync(data.password, 10);
    const result=await User.updateOne({
      userEmail:data.userEmail},{$set:{password:pass}}
    );
    if(result.modifiedCount)
        return res.status(200).json({ message: "password changed", reset: true });
    else
        return res.status(400).json({ message: "reset process failed", reset: false });

  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

module.exports = { SignUp, Login , SendOtp , VerifyOTP , PasswordReset};
