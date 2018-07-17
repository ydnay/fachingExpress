const express       = require("express");
const router        = express.Router();
const User          = require('../models/User');
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
  console.log(req.session.passport.user);
  console.log(req.params.id);
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

module.exports = router;