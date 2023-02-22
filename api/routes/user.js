const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { REGISTER, LOGIN, CHECK_LOGIN_STATUS } = require("../controllers/user");

router.post("/register", REGISTER);

router.post("/login", LOGIN);

router.get("/checkLoginStatus", CHECK_LOGIN_STATUS);

module.exports = router;
