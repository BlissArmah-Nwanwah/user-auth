const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");

const {
  registerUser,
  loginUser,
  updateUser,
  changePassword,
} = require("../controllers/user");
 
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.patch("/updateUser", authenticateUser, updateUser);
router.patch("/updatePassword", authenticateUser, changePassword);

module.exports = router;
