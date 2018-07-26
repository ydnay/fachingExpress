const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.get('/', (req, res, next) => {
//   if (req.user) {
//   const userId = req.user._id;
//   console.log(userId, "userId");
//   res.render('index', { user: userId });}
//   else {
//     res.render('index');
//   }
// });

module.exports = router;
