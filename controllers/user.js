const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const registerUser = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email Already Exist");
    }
    const user = await User.create({ ...req.body });
    const token = await user.createJWT();
    res
      .status(StatusCodes.CREATED)
      .json({
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
    const { firstName, lastName, email, phoneNumber, image, gender } = req.body;
    if (!firstName || !lastName || !email || !phoneNumber || !image || gender) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please provide all values" });
    }
    const user = await User.findOne({ _id: req.user.userId });
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.gender = gender;
    user.image = image;

    await user.save();
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
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

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    user.password = req.body.newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ error: "hi" });
  }
};

module.exports = { registerUser, loginUser, updateUser, changePassword };
