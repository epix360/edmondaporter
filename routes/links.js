const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const multer = require('multer');
const Profile = require('../models/profile');
const Link = require('../models/link');
const { cloudinary } = require('../cloudinary');

router.get('/', catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    const link = await Link.findOne({});
    const links = await Link.find({});
    res.render('links/show', { profile, link, links, currentPage: 'links', title: 'Edmond A. Porter | Links' })
}))

router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    res.render('links/new', { profile, currentPage: 'links' })
}))

router.post('/', catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    const publicId = req.body.link.imageIds;
    const idArr = publicId.split(',');
    const imageId = idArr;
    const link = new Link(req.body.link);
    link.imageIds = imageId;
    profile.links.push(link);
    link.profile = profile;
    const imageIdsToDelete = req.body.link.imageIdsToDelete;
    const idsToDelete = imageIdsToDelete.split(',');
    await cloudinary.api
        .delete_resources(idsToDelete,
            { type: 'upload', resource_type: 'image', invalidate: true })
        .then(console.log);
    await profile.save();
    await link.save();
    req.flash('success', 'Successfully created new blog post!');
    res.redirect('/links')
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const link = await Link.findById(id);
    const links = await Link.find({});
    res.render('links/show', { link, links, currentPage: 'links' })
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const link = await Link.findById(id);
    const links = await Link.find({});
    if (!link) {
        req.flash('error', 'Cannot find that publication!');
        return res.redirect('/');
    }
    res.render('links/edit', { link, links, currentPage: 'links' })
}))

router.put('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const link = await Link.findOneAndUpdate({ id: { $eq: req.params._id } }, req.body, { runValidators: true, new: true });
    const imageIdsToDelete = req.body.link.imageIdsToDelete;
    const idsToDelete = imageIdsToDelete.split(',');
    await cloudinary.api
        .delete_resources(idsToDelete,
            { type: 'upload', resource_type: 'image', invalidate: true })
        .then(console.log);
    req.flash('success', 'Successfully updated publication list!');
    res.redirect('/links')
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    res.redirect('/')
}))

module.exports = router;