const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const multer = require('multer');
const Profile = require('../models/profile');
const Publication = require('../models/publication');
const { cloudinary } = require('../cloudinary');

router.get('/', catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    const publication = await Publication.findOne({});
    const publications = await Publication.find({});
    res.render('publications', { profile, publication, publications, currentPage: 'publications', title: 'Edmond A. Porter | Publications' })
}))

router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    res.render('publications/new', { profile, currentPage: 'publications' })
}))

router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    const publicId = req.body.publication.imageIds;
    const idArr = publicId.split(',');
    const imageId = idArr;
    const publication = new Publication(req.body.publication);
    publication.imageIds = imageId;
    profile.publications.push(publication);
    publication.profile = profile;
    const imageIdsToDelete = req.body.publication.imageIdsToDelete;
    const idsToDelete = imageIdsToDelete.split(',');
    await cloudinary.api
        .delete_resources(idsToDelete,
            { type: 'upload', resource_type: 'image', invalidate: true })
        .then(console.log);
    await profile.save();
    await publication.save();
    req.flash('success', 'Successfully created new blog post!');
    res.redirect('/publications')
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const publication = await Publication.findById(id);
    const publications = await Publication.find({});
    res.render('publications/show', { publication, publications, currentPage: 'publications' })
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const publication = await Publication.findById(id);
    const publications = await Publication.find({});
    if (!publication) {
        req.flash('error', 'Cannot find that publication!');
        return res.redirect('/');
    }
    res.render('publications/edit', { publication, publications, currentPage: 'publications' })
}))

router.put('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const publication = await Publication.findOneAndUpdate({ id: { $eq: req.params._id } }, req.body, { runValidators: true, new: true });
    const imageIdsToDelete = req.body.publication.imageIdsToDelete;
    const idsToDelete = imageIdsToDelete.split(',');
    await cloudinary.api
        .delete_resources(idsToDelete,
            { type: 'upload', resource_type: 'image', invalidate: true })
        .then(console.log);
    req.flash('success', 'Successfully updated publication list!');
    res.redirect('/publications')
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    res.redirect('/')
}))

module.exports = router;