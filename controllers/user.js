const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email Already Exist");
    }
    const user = await User.create({ ...req.body });
    const token = await user.createJWT();
    res.status(StatusCodes.CREATED).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        image: user.image,
      },
      token,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid email or password" });
    }
    const token = user.createJWT();
    return res.status(StatusCodes.OK).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        image: user.image,
      },
      token,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
   return res.status(StatusCodes.OK).json({ user });
  } catch (error) { 
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};

const changePassword = async (req, res) => {
  try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const user = await User.findOneAndUpdate(
      { _id: req.user.userId },
      {password: password},
      { new: true, runValidators: true }
    );
   return res.status(StatusCodes.CREATED).json({ msg:"Password Modified" });
  } catch (error) { 
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message});
  }
};

module.exports = { registerUser, loginUser, updateUser, changePassword };
