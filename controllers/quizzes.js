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
  const { id, page } = req.query;
  const queryObject = {};
  if (id) {
    queryObject.id = id;
  }
  if (page) {
    queryObject.page = page;
  }
  console.log(page);
  const questionsPerPage = 1; // Number of questions per page
  const currentPage = parseInt(page) || 1;

  try {
    const quiz = await Quiz.findOne({ _id: queryObject.id });

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

    res.status(StatusCodes.OK).json({questions, pagination });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
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

module.exports = { getAllQuizzes, createQuiz, totalMarks,getQuizQuestions };
