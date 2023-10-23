const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");

const {
  getAllQuizzes,
  createQuiz,totalMarks
} = require("../controllers/quizzes");

router.get("/", getAllQuizzes);
router.post("/createquiz", createQuiz);
router.post("/totalMarks", totalMarks);

module.exports = router; 
