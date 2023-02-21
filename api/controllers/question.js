const bcrypt = require("bcryptjs");
const { rawListeners } = require("../models/userModel"); //neaišku kam
const jwt = require("jsonwebtoken");

const questionSchema = require("../models/question");
const userSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

//  + CREATE QUESTION---------------------------------

module.exports.POST_QUESTION = async (req, res) => {
  const jwt_token = req.headers.user_jwt;
  const tokenInfo = jwt.verify(jwt_token, process.env.JWT_SECRET);

  const question = new questionSchema({
    title: req.body.title,
    questionText: req.body.questionText,
    userId: tokenInfo.userId,
    answerId: [],
    timeStamp: new Date(),
  });

  question
    .save()
    .then((result) => {
      questionSchema
        .updateOne({ _id: question._id }, { id: question._id })
        .exec();
      userSchema
        .updateOne(
          { _id: tokenInfo.userId },
          { $push: { questions: result._id.toString() } }
        )
        .exec();
      return res.status(200).json({
        response: "Ticket was created succses",
        result,
      });
    })

    .catch((err) => {
      console.log("err");
      res.status(400).json({ responce: "error" });
    });
};

// + GET ALL QUESTIONS -----------------------------------------

module.exports.GET_ALL_QUESTIONS = function (req, res) {
  questionSchema
    .find()
    .sort({ title: -1 })
    .then((results) => {
      return res.status(200).json({ questions: results });
    });
};
// GET QUESTION BY ID---------------------------------------

module.exports.GET_QUESTIONS_BY_ID = function (req, res) {
  questionSchema.findOne({ _id: req.params.id }).then((results) => {
    return res.status(200).json({ results });
  });
};

// + DELETE QUESTION BY ID-----------------------------------------

module.exports.DELETE_QUESTION_BY_ID = async function (req, res) {
  try {
    const jwt_token = req.headers.user_jwt;
    if (!jwt_token) {
      return res.status(401).end();
    }
    const tokenInfo = jwt.verify(jwt_token, process.env.JWT_SECRET);

    const questionData = await questionSchema
      .findOne({ _id: req.params.id })
      .exec();

    if (!(tokenInfo.userId === questionData.userId))
      return res.status(401).end();

    await questionSchema.deleteOne({ _id: req.params.id }).exec();
    return res.status(200).json({ status: "Deleted" });
  } catch (error) {
    res.status(500).json({ response: "Failed" });
  }
};

// // BUY TICKET-------------------------------------

// module.exports.BUY_TICKET = async function (req, res) {
//   const ticket = await ticketsSchema
//     .findOne({ _id: req.body.ticket_id })
//     .exec();

//   console.log(ticket.ticket_price);

//   const user = await userSchema.findOne({ _id: req.body.user_id }).exec();

//   console.log(user);

//   const moneyLeft = user.money_balance - ticket.ticket_price;
//   console.log(moneyLeft);

//   if (moneyLeft >= 0) {
//     userSchema
//       .updateOne(
//         { _id: req.body.user_id },
//         { $push: { bought_tickets: ticket._id.toString() } }
//       )
//       .updateOne({ _id: req.body.user_id }, { money_balance: moneyLeft })

//       .then((result) => {
//         res.status(200).json({ Message: "Ticket bought" });
//       });
//   } else {
//     return res.status(400).json({ Message: "not enought money" });
//   }
// };
