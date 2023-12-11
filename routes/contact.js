const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

router.get('/', catchAsync(async (req, res) => {
    res.render('contact', { currentPage: 'contact', title: 'Edmond A. Porter | Contact' })
}))

module.exports = router;