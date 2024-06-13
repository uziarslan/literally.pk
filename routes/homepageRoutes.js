const express = require('express');
const router = express()
const wrapAsync = require('../utils/wrapAsync');
const mongoose = require('mongoose');
const Insta = mongoose.model('Insta');
const Youtube = mongoose.model('Youtube');
const Blog = mongoose.model('Blog');



// Homepage Routes
router.get('/', wrapAsync(async (req, res) => {
    const instaPosts = await Insta.find({});
    const youtubePosts = await Youtube.find({});
    const blogs = await Blog.find({});
    res.render('./homepages/index', { instaPosts, youtubePosts, blogs });
}));


// Exporting the router
module.exports = router;