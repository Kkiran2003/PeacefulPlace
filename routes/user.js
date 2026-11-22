const express = require("express");
 const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveredirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js")

const router = express.Router();

router.route("/signup")
    .get(userController.rendersignup)
    .post(userController.signup);

router.route("/login")
    .get(userController.renderlogin)
    .post(saveredirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),userController.login);
    
router.get("/logout", userController.logout);

module.exports = router