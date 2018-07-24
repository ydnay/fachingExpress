const express       = require('express');
const router        = express.Router();
const User          = require('../models/User');
const Bird          = require('../models/Bird');
const ensureLogin   = require('connect-ensure-login');

// Show form to add bird
router.get('/add-bird', (req, res, next) => {
  res.render('birds/add-bird');
});

// Add bird
router.post('/add-bird', (req, res, next) => {
  const name      = req.body.name;
  const color     = req.body.color;
  const dob       = req.body.dob;
  const catches   = req.body.catches;
  const keeper    = req.session.passport.user;
  console.log(name, color, dob, catches, keeper);
  // console.log(new Date(dob).getFullYear());
  const day       = new Date(dob).getDay();
  const month     = new Date(dob).getMonth();
  const year      = new Date(dob).getFullYear();

  if (name === '' || color === '') {
    res.render('birds/add-bird', { message: 'Indicate name and color' });
    return;
  }

  Bird.findOne({ name })
  .then(bird => {
    if (bird !== null) {
      res.render('birds/add-bird', { message: 'The bird already exists' });
      return;
    }

    const newBird = new Bird({ name, color, dob, catches, keeper });

    newBird.save((err) => {
      if (err) {
        res.render('birds/add-bird', { message: `Something went wrong ${err}` });
      }
    })
    .then((birdFromDb) => {
      // console.log(`bird form db after adding bird`, birdFromDb);
      res.redirect('/users/dashboard');
    })
    .catch(error => {
      next(error)
    })
  })
  .catch(error => {
    next(error)
  })
});

// Show form to edit bird
router.get('/edit', (req, res, next) => {
  res.render('birds/edit-bird');
});

// Edit bird
// router.post('/edit', (req, res, next) => {
//   const { name, color, dob, catches } = req.body;
//   const keeper = req.session.passport.user;
//   Book.findOneAndUpdate({ keeper: keeper}, { $set: {name, color, dob, catches }})
//   .then((bird) => {
//     res.redirect('/users/dashboard')
//   })
//   .catch((error) => {
//     next(error)
//   });
// });

// Delete bird
// router.get('/delete', (req, res, next) => {
//   const keeper = req.session.passport.user;
//   Bird.findOneAndRemove(keeper)
//   .then(bird => {
//     res.redirect('/users/dashboard');
//   })
//   .catch(err => {
//     next(err);
//   });
// });

module.exports = router;