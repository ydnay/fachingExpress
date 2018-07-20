const express       = require("express");
const router        = express.Router();
const User          = require('../models/User');
const Bird          = require('../models/Bird');

router.get('/add-bird', (req, res, next) => {
  res.render('birds/add-bird');
});

router.post('/add-bird', (req, res, next) => {
  const name      = req.body.name;
  const color     = req.body.color;
  const dob       = req.body.dob;
  const captures  = req.body.captures;
  const keeper    = req.session.passport.user;
  console.log(name, color, dob, captures, keeper);

  if (name === `` || color === ``) {
    res.render(`/birds/add-bird`, { message: `Indicate name and color` });
    return;
  }

  Bird.findOne({ name })
  .then(bird => {
    if (bird !== null) {
      res.render(`birds/add-bird`, { message: `The bird already exists` });
      return;
    }

    const newBird = new User({
      name,
      color,
      dob,
      captures,
      keeper
    });

    newBird.save((err) => {
      if (err) {
        res.render(`birds/add-bird`, { message: `Something went wrong ${err}` });
      }
    })
    .then((birdFromDb) => {
      console.log(`bird form db after adding bird`, birdFromDb);
      res.redirect(`/users/dashboard`);
    })
  })
  .catch(error => {
    next(error)
  })
});

module.exports = router;