const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  POST_QUESTION,
  GET_ALL_QUESTIONS,
  DELETE_QUESTION_BY_ID,
  GET_QUESTIONS_BY_ID,
  GET_ALL_QUESTIONS_WITH_USER_DATA,
} = require("../controllers/question");

router.post("/question", auth, POST_QUESTION);
router.get("/questions", GET_ALL_QUESTIONS);
router.get("/questions/:id", GET_QUESTIONS_BY_ID);
router.delete("/question/:id", auth, DELETE_QUESTION_BY_ID);
router.get("/questionsWithUsers", GET_ALL_QUESTIONS_WITH_USER_DATA);

module.exports = router;
