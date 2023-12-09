const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');
const passport = require('passport');
const Profile = require('../models/profile');

router.get('/', catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ pname: { $eq: req.params.pname } });
    const profiles = await Profile.find({})
    res.render('login', { profile, profiles, currentPage: 'login' })
}))

router.post('/',
    storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/';
        res.redirect(redirectUrl);
    });

module.exports = router;