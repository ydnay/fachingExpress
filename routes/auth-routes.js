const express = require("express");
const authRoutes = express.Router();
const zxcvbn = require('zxcvbn');
const Recaptcha = require('express-recaptcha').Recaptcha;
const recaptcha = new Recaptcha('qwerty', 'secret');


// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup", { captcha:recaptcha.render() });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
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
      const checkPass = zxcvbn(password);
      console.log('checkPass: ', checkPass);
    
      const newUser  = User({
        username,
        password: hashPass
      });
    
      newUser.save()
      .then(user => {
        res.redirect("/");
      })
  });
})

module.exports = authRoutes;