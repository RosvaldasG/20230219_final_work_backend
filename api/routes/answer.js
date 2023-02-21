const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  POST_ANSWER,
  GET_ALL_ANSWERS_BY_QUESTION_ID,
  DELETE_ANSWER_BY_ID,
  CHANGE_ANSWER_LIKES,
} = require("../controllers/answers");

router.post("/question/:id/answers", POST_ANSWER);
router.get("/question/:id/answers", GET_ALL_ANSWERS_BY_QUESTION_ID);
router.delete("/answers/:id", DELETE_ANSWER_BY_ID);
router.post("/answersLikes/:id", CHANGE_ANSWER_LIKES);

module.exports = router;
