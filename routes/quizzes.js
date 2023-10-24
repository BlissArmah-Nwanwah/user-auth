const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");

const {
  getAllQuizzes,
  createQuiz,totalMarks,
  getQuizQuestions
} = require("../controllers/quizzes");

router.get("/", getAllQuizzes);
router.get("/questions/:id", getQuizQuestions);
router.post("/createquiz", createQuiz);
router.post("/totalMarks", totalMarks);

module.exports = router; 
 