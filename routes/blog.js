const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const multer = require('multer');                                                                                                           
const Profile = require('../models/profile');
const BlogPost = require('../models/blogpost');
const { cloudinary } = require('../cloudinary');

router.get('/', catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });  
    const blogPosts = await BlogPost.find({ profile: profile._id }).limit(20).sort({ date: -1 });
    res.render('blog/index', { profile, blogPosts, currentPage: 'blog', title: 'Edmond A. Porter | Blog' })
}))

router.get('/archive', catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });  
    const blogPosts = await BlogPost.find({ profile: profile._id }).sort({ date: -1 });
    res.render('blog/archive', { profile, blogPosts, currentPage: 'blog/archive' })
}))

router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    res.render('blog/new', { profile, currentPage: 'blog' })
}))

router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    const publicId = req.body.blogPost.imageIds;
    const idArr = publicId.split(',');
    const imageId = idArr;
    const blogPost = new BlogPost(req.body.blogPost);           
    blogPost.imageIds = imageId;
    profile.blogPosts.push(blogPost);
    blogPost.profile = profile;
    const imageIdsToDelete = req.body.blogPost.imageIdsToDelete;
    const idsToDelete = imageIdsToDelete.split(',');
    await cloudinary.api
        .delete_resources(idsToDelete,
            { type: 'upload', resource_type: 'image', invalidate: true })
        .then(console.log);
    await profile.save();
    await blogPost.save();
    req.flash('success', 'Successfully created new blog post!');
    res.redirect('/blog')
}))

router.get('/:slug', catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    const profiles = await Profile.find({});
    const blogPost = await BlogPost.findOne({ slug: { $eq: req.params.slug } }).populate('profile', 'name');
    const blogPosts = await BlogPost.find({ profile: profile._id }).limit(20).sort({ date: -1 });
    if (!blogPost) {
        req.flash('error', 'Post not found!');
        return res.redirect('/blog/show');
    }
    res.render('blog/show', { profile, profiles, blogPost, blogPosts, currentPage: 'blog' })
}))

router.get('/:slug/edit', isLoggedIn, catchAsync(async (req, res) => {
    const blogPost = await BlogPost.findOne({ slug: { $eq: req.params.slug } })
    res.render('blog/edit', { blogPost, currentPage: 'blog' })
}))

router.put('/:slug', isLoggedIn, catchAsync(async (req, res) => {
    const profile = await Profile.findOne({ id: { $eq: req.params._id } });
    const blogPost = await BlogPost.findOneAndUpdate({ slug: { $eq: req.params.slug } }, req.body, { runValidators: true, new: true });
    const imageIdsToDelete = req.body.blogPost.imageIdsToDelete;
    const idsToDelete = imageIdsToDelete.split(',');
    await cloudinary.api
        .delete_resources(idsToDelete,
            { type: 'upload', resource_type: 'image', invalidate: true })
        .then(console.log);
    req.flash('success', 'Successfully updated blog post!');
    res.redirect(`/blog/${blogPost.slug}`)
}))

router.delete('/:slug', isLoggedIn, catchAsync(async (req, res) => {
    const blogPost = await BlogPost.findOne({ id: { $eq: req.params._id } });
    const idsToDelete = blogPost.imageIds;
    await cloudinary.api
        .delete_resources(idsToDelete,
            { type: 'upload', resource_type: 'image', invalidate: true })
        .then(console.log);
    await BlogPost.findOneAndDelete({ slug: { $eq: req.params.slug } });
    req.flash('success', 'Successfully deleted blog post')
    res.redirect('/blog');
}))

module.exports = router;