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

const getQuizQuestions = async (req, res) => {
  const { id } = req.params;
  const { page } = req.query;
  const questionsPerPage = 1; // Number of questions per page
  const currentPage = parseInt(page) || 1;

  try {
    const quiz = await Quiz.findOne({ _id: id });

    if (!quiz) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No quiz with _id: ${id}` });
    }

    const totalQuestions = quiz.questions.length;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);

    if (currentPage < 1 || currentPage > totalPages) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: `Invalid page number: ${currentPage}` });
    }

    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);

    const questions = quiz.questions.slice(startIndex, endIndex);

    const pagination = {
      currentPage,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      totalPages,
    };

    res.status(StatusCodes.OK).json({ questions, pagination });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getQuizQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: id }).select("-rating -__v -subject -level -title -duration");

    if (!quiz) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No quiz with _id: ${id}` });
    }

    const questions = quiz.questions

    res.status(StatusCodes.OK).json({ quiz });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const totalMarks = async (req, res) => {
  const { _id, answers } = req.body;
  try {
    const quiz = await Quiz.findOne({ _id: _id });
    let totalMarks = 0;
    const result = [];

    for (const submittedAnswer of answers) {
      const question = quiz?.questions.find(
        (q) => q._id.toString() === submittedAnswer._id
      );

      let isCorrect = false;

      if (question && question.correctAnswer === submittedAnswer.answer) {
        totalMarks++;
        isCorrect = true;
      }

      result.push({
        _id: question._id,
        options: question.options,
        question: question.question,
        answer: submittedAnswer.answer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    }

    return res.status(StatusCodes.OK).json({
      _id: quiz._id,
      totalMarks,
      questions: result,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};


module.exports = { getAllQuizzes, createQuiz, totalMarks, getQuizQuestions,getQuizQuestion };
