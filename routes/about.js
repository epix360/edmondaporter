const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const Profile = require('../models/profile');
const BlogPost = require('../models/blogpost');

// router.get('/', catchAsync(async (req, res) => {
//       const profiles = await Profile.find({});
//       res.render('about/index', {profiles})
//   }))
  
  router.get('/new', catchAsync(async (req, res) => {
    res.render('about/new', { currentPage: 'about' })
  }))

  router.get('/', catchAsync(async (req, res) => {
    // const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    // const blogPosts = await BlogPost.find({ profile: profile._id }).sort({ date: -1 });
    res.render('about/show', {currentPage: 'about'})
  }))
  
  
  router.post('/new', upload.single('image'), catchAsync(async (req, res, next) => {
    try {
      const { name, pname, username, password, image, filename, bio } = req.body;
      const profile = new Profile({ name, pname, username, image, filename, bio });
      profile.image = req.file.path;
      profile.filename = req.file.filename;
      const registeredUser = await Profile.register(profile, password);
      req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'You\'re in!!');
        res.redirect('about');
      })
  
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('about/show')
    }
  }))
  
  router.get('/edit', isLoggedIn, catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    if (!profile) {
      req.flash('error', 'Cannot find that profile!');
      return res.redirect('/');
    }
    res.render('about/edit', { profile, currentPage: 'about' })
  }))
  
  router.put('/', isLoggedIn, upload.single('image'), catchAsync(async (req, res) => {
    let updateQuery = {};
  
    if (req.body.name) {
        updateQuery = req.body.name
    }
  
    const profile = await Profile.findOneAndUpdate({ id: { $eq: req.params._id }}, { ...req.body }, { runValidators: true, new: true });
  
    if (req.file) {
        profile.image = req.file.path;
        profile.filename = req.file.filename
    }
  
    await profile.save();
    req.flash('success', 'Successfully updated profile!');
    res.redirect('/about')
  }))

module.exports = router;