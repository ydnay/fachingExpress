const express       = require('express');
const router        = express.Router();
const User          = require('../models/User');
const Bird          = require('../models/Bird');
const ensureLogin   = require('connect-ensure-login');
// const bcrypt        = require('bcrypt');

// router.use((req, res, next) => {
//   if (req.session.currentUser) {
//     next();
//     return;
//   }

//   res.redirect('/login');
// });

router.get('/dashboard', (req, res, next) => {
  const user = req.session.passport.user;
  User.findById(user, (err, foundUser) => { 
    if (err) {
      console.log(err);
      next(err);
      return;
    }
    console.log(foundUser);
    res.render('users/dashboard', { foundUser });
  });
});

router.get('/birds', (req, res, next) => {
  // const keeper = req.session.passport.user;
  // console.log(keeper);
  Bird.find({ keeper: req.session.passport.user }, (err, foundBirds) => {
    if (err) {
      console.log(err);
      next(err);
      return;
    }
    console.log(foundBirds);
    res.render('users/birds', { foundBirds });
  })
});

module.exports = router;