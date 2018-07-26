const express       = require('express');
const authRoutes    = express.Router();
const passport      = require('passport');
const ensureLogin   = require('connect-ensure-login');
const ensureLogout  = require('connect-ensure-login');
const uploadCloud   = require('../config/cloudinary.js');

// User model
const User          = require('../models/User');

// // Bcrypt to encrypt passwords
const bcrypt        = require('bcrypt');
const bcryptSalt    = 10;

authRoutes.get('/login', (req, res, next) => {
  // const userId = req.user._id;
  // console.log(userId);
  res.render('auth/login', {'message': req.flash('error') });
});

authRoutes.post('/login', passport.authenticate('local-login', {
  successRedirect: '/users/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

// Need sign up local strategy
// authRoutes.post('/signup', ensureLogout.ensureLoggedOut(), passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/auth/signup',
//   failureFlash: true, 
//   passReqToCallback: true
// }));

authRoutes.post('/signup', uploadCloud.single('profilePic'), (req, res, next) => {
  console.log(req.file, req.body);
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' });
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
        res.render('auth/signup', { message: `Something went wrong ${err}` });
      } else {
        res.render('auth/login');
      }
    })
    // .then((userFromDb) => {
    //   // console.log('user form db after sign up', userFromDb);
    //   // req.session.currentUser = userFromDb
    //   res.redirect('/login');
    // })
  })
  .catch(error => {
    next(error)
  })
});

authRoutes.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
  });  
  res.redirect('/login');
});

module.exports = authRoutes;