const express = require("express");
const authRoutes = express.Router();
// const zxcvbn = require('zxcvbn');
// const Recaptcha = require('express-recaptcha').Recaptcha;
// const recaptcha = new Recaptcha('qwerty', 'secret');
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


// User model
const User           = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

// authRoutes.get("/signup", (req, res, next) => {
//   res.render("auth/signup", { captcha:recaptcha.render() });
// });

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username === "" || password === "") {
    res.render("auth/signup", { errorMessage: "Indicate a username and a password to sign up" });
    return;
  }

  User.findOne({ "username": username })
      .then(user => {
        console.log('user', user);
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      // const checkPass = zxcvbn(password);
      // console.log('checkPass: ', checkPass);
    
      const newUser  = User({
        username,
        password: hashPass
      });
    
      newUser.save((err) => {
        if (err) { res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
  })
  .catch(error => {
    next(error)
  })
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = authRoutes;