const express       = require("express");
const authRoutes    = express.Router();
const passport      = require("passport");
const ensureLogin   = require('connect-ensure-login');
const ensureLogout  = require('connect-ensure-login');

// User model
const User          = require("../models/User");

// // Bcrypt to encrypt passwords
const bcrypt        = require("bcrypt");
const bcryptSalt    = 10;

authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private", { user: req.user });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", ensureLogout.ensureLoggedOut(), passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// authRoutes.get('/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
//   console.log(req);
//   User.findById(req.params)
//     .then(user => {
//       console.log(req.params.id)
//       res.render('users/dashboard', {user});
//       console.log(req.params.id);
//     })
//     .catch(err => {
//       console.log(`User not found ${err}`);
//       next();
//     });
// });

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// Need sign up local strategy
// authRoutes.post('/signup', ensureLogout.ensureLoggedOut(), passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/auth/signup',
//   failureFlash: true, 
//   passReqToCallback: true
// }));

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
      }
    })
    .then((userFromDb) => {
      console.log("user form db after sign up", userFromDb);
      req.session.currentUser = userFromDb
      res.redirect("/private-page");
    })
  })
  .catch(error => {
    next(error)
  })
});

// authRoutes.get('/logout', (req, res, next) => {
//   if (!req.session.currentUser) {
//     res.redirect('/login');
//     return;
//   }

//   req.session.destroy((err) => {
//     if (err) {
//       next(err);
//       return;
//     }

//     req.logout();
//     res.redirect('/login');
//   });
// });

authRoutes.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
  });  
  res.redirect("/login");
});

module.exports = authRoutes;