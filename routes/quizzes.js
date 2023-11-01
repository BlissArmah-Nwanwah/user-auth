const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");

const {
  getAllQuizzes,
  createQuiz,totalMarks,
  getQuizQuestions,
  getQuizQuestion
} = require("../controllers/quizzes");

router.get("/", getAllQuizzes);
router.get("/questions/:id", getQuizQuestions);
router.get("/question/:id", getQuizQuestion);
router.post("/createquiz", createQuiz);
router.post("/totalMarks", totalMarks);

module.exports = router; 
 