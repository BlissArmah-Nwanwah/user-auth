const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const QuizSchema = new mongoose.Schema({
  questions: [
    {
      question: {
        type: String,
        required: [true, "Please provide question"],
      },
      answer: {
        type: String,
      },
      options: {
        type: Array,
        required: [true, "Please provide options"],
      },
      correctAnswer: {
        type: String,
        required: [true, "Please provide correct answer"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  subject: {
    type: String,
    required: [true, "Please provide subject"],
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, "Please provide a valid level (beginner, intermediate, or advanced)"],
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
    unique: [true, "Quiz with title exit already"],
  },
  duration: {
    type: String,
    required: [true, "Please provide a duration"],
  },
  rating: [
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
          },
          rate: {
            type: Number,
            required: true,
          }
    }
  ]
});

module.exports = mongoose.model("Quiz", QuizSchema);
