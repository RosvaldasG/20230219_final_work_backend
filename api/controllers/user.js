const bcrypt = require("bcryptjs");
// const { rawListeners } = require("../models/userModel"); //neaišku kam
const jwt = require("jsonwebtoken");

const UserSchema = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

// REGISTER---------------------------------

module.exports.REGISTER = async (req, res) => {
  try {
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
          console.log(user._id);
          UserSchema.updateOne({ _id: user._id }, { id: user._id }).exec();
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
  } catch (error) {
    return res.status(404).json({ status: "Klaida" });
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

/// CHECK LOGIN STATUS

module.exports.CHECK_LOGIN_STATUS = async (req, res) => {
  const user_jwt = await req.headers.user_jwt;
  jwt.verify(user_jwt, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      return res.status(200).json({
        status: "Login valid",
      });
    } else {
      return res.status(400).json({ status: "Please Login or Register" });
    }
  });
};

// Functions
// Check user name

const checkName = (data) => {
  return data.charAt(0).toUpperCase() + data.toLowerCase().slice(1);
};

// Check password

const checkPassword = (data) => {
  if (data.length < 6 || data.match(/\d+/) === null) {
    return false;
  } else {
    return true;
  }
};
