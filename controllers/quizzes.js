const Quiz = require("../models/Quiz");
const { StatusCodes } = require("http-status-codes");

const createQuiz = async (req, res) => {
  const { title } = req.body;
  const existingQuiz = await Quiz.findOne({ title });
  if (existingQuiz) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Quiz with title ${title} already exist` });
  }
  const quiz = await Quiz.create(req.body);
  res.status(StatusCodes.CREATED).json({ quiz });
};

const getAllQuizzes = async (req, res) => {
  const { subject, level, title } = req.query;
  const queryObject = {};
  if (subject) {
    queryObject.subject = subject;
  }
  if (level) {
    queryObject.level = level;
  }

  let result = Quiz.find(queryObject).select("-questions");
  if (title) {
    queryObject.title = title;
    result = Quiz.find(queryObject).select("-correctAnswer");
  }
  const quiz = await result;
  if (!quiz) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No quiz with  : ${subject}` });
  }
  res.status(StatusCodes.OK).json({ quiz });
};

const totalMarks = async (req, res) => {
  const { allAnswer } = req.body;
  try {
    const questions = await Quiz.findOne({ _id: allAnswer._id });
    let totalMarks = 0;
    for (const submittedAnswer of allAnswer.answers) {
      const question = questions?.questions.find(
        (q) => q._id.toString() === submittedAnswer._id
      );

      if (question && question.correctAnswer === submittedAnswer.answer) {
        totalMarks++;
      }
    }
    return res.status(StatusCodes.OK).json({ total: totalMarks });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

module.exports = { getAllQuizzes, createQuiz, totalMarks };
