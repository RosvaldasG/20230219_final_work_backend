const bcrypt = require("bcryptjs");
// const { rawListeners } = require("../models/userModel"); //neaišku kam
const jwt = require("jsonwebtoken");

const UserSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

// REGISTER---------------------------------

module.exports.REGISTER = async (req, res) => {
  if (!checkPassword(req.body.password)) {
    return res.status(400).json({ responce: "check password" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10); // užkoduojama slaptažodį

  const user = new UserSchema({
    name: checkName(req.body.name),
    email: req.body.email,
    password: hashedPassword,
    questions: [],
    answers: [],
    timeStamp: new Date(),
  });

  const userCheck = await UserSchema.findOne({ email: req.body.email });

  if (userCheck === null) {
    user
      .save()
      .then((result) => {
        const jwt_token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" },
          { algorythm: "RS256" }
        );

        return res.status(200).json({
          response: "User was created succses",
          result,
          jwt_token,
        });
      })
      .catch((err) => {
        res.status(400).json({ responce: "validation error" });
      });
  } else {
    return res.status(400).json({ responce: "user already exist" });
  }
};

// USER LOGIN---------------------------------------------

module.exports.LOGIN = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordMatch) {
      const jwt_token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        { algorythm: "RS256" }
      );

      return res.status(200).json({
        status: "login successfull",
        jwt_token: jwt_token,
        user,
      });
    }
    return res.status(404).json({ status: "login failed" });
  } catch (err) {
    return res.status(404).json({ status: "login failed" });
  }
};

// USER daugiau kaip ir nieko nereikia.
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// GET ALL USERS-------------------

module.exports.GET_ALL_USERS = function (req, res) {
  UserSchema.find()
    .sort({ name: 1 })
    .then((results) => {
      return res.status(200).json({ totalUsers: results });
    });
};

// GET USER BY ID--------------------------
module.exports.GET_USER_BY_ID = async function (req, res) {
  const jwt_token = req.headers.jwt_token;
  jwt.verify(jwt_token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err && req.params.id === decoded.userId) {
      UserSchema.findOne({ _id: req.params.id }).then((results) => {
        return res.status(200).json({ User: results });
      });
    } else {
      return res.status(404).json({ status: "auth failed" });
    }
  });
};

// getAllUsersWithTickets--------------------------------------

module.exports.GET_ALL_USERS_WITH_TICKETS = async function (req, res) {
  const data = await UserSchema.aggregate([
    {
      $lookup: {
        from: "nodejs_exam_tickets",
        localField: "bought_tickets",
        foreignField: "id",
        as: "bought_tickets",
      },
    },
  ]).exec();

  return res.status(200).json({ user: data });
};

// getUserByIdWithTickets--------------------------------------

module.exports.GET_USER_BY_ID_WITH_TICKETS = async function (req, res) {
  const data = await UserSchema.aggregate([
    {
      $lookup: {
        from: "nodejs_exam_tickets",
        localField: "bought_tickets",
        foreignField: "id",
        as: "bought_tickets",
      },
    },
    { $match: { _id: ObjectId(req.params.id) } },
  ]).exec();

  return res.status(200).json({ user: data });
};

// Functions
// Check user name

const checkName = (data) => {
  return data.charAt(0).toUpperCase() + data.toLowerCase().slice(1);
};

// Check password

const checkPassword = (data) => {
  if (data.length < 6 && data.match(/\d+/) === null) {
    return false;
  } else {
    return true;
  }
};
