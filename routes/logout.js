const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Goodbye!');
      res.redirect('/');
    });
  });

module.exports = router;