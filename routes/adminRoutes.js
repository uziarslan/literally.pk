const express = require('express');
const router = express();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isAdmin } = require('../middlewares/index');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const Insta = mongoose.model('Insta');
const Youtube = mongoose.model('Youtube');
const Blog = mongoose.model('Blog');
const multer = require('multer');
const { storage } = require('../cloudinary');
const passport = require('passport');
const upload = multer({ storage });
const { uploader } = require('cloudinary').v2




router.get('/admin/signup', wrapAsync(async (req, res) => {
    res.render('./admin/signup');
}));

router.post('/signup', wrapAsync(async (req, res) => {
    const { username, password } = req.body;
    const foundAdmin = await Admin.find({ username });
    if (foundAdmin.length) {
        req.flash('error', 'Admin is already registered!');
        return res.redirect('/admin/signup')
    }
    const admin = new Admin({ username, role: 'admin' });
    const registeredAdmin = await Admin.register(admin, password, function (err, newAdmin) {
        if (err) {
            next(err)
        }
        req.logIn(newAdmin, () => {
            res.redirect('/admin/instagram/posts')
        })
    })
}));


router.get('/admin/login', wrapAsync(async (req, res) => {
    res.render('./admin/login');
}));

router.post('/login', passport.authenticate('admin', { failureRedirect: '/admin/login', failureFlash: { type: 'error', message: 'Invalid Email or Password' } }), wrapAsync(async (req, res) => {
    res.redirect('/admin/instagram/posts')
}));

router.get('/logout', wrapAsync(async (req, res) => {
    req.logout(req.user, () => {
        req.flash('success', 'Admin is now logged out!')
        res.redirect('/admin/login')
    })
}))


router.get('/admin/instagram/posts', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const posts = await Insta.find({});
    res.render('./admin/instagram', { posts });
}));

router.post('/instagram', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const post = new Insta({ ...req.body });
    await post.save();
    req.flash('success', 'Post has been added!');
    res.redirect('/admin/instagram/posts');
}));

router.get('/instagram/edit/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Insta.findById(id);
    res.render('./admin/editinsta', { post });
}));

router.put('/instagram/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Insta.findByIdAndUpdate(id, { ...req.body });
    await post.save();
    res.redirect('/admin/instagram/posts');
}));

router.delete('/instagram/delete/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Insta.findByIdAndDelete(id);
    req.flash('success', 'Post has been deleted successfully!');
    res.redirect('/admin/instagram/posts');
}));

router.get('/admin/youtube/posts', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const posts = await Youtube.find({});
    res.render('./admin/youtube', { posts });
}));

router.post('/youtube', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const post = new Youtube({ ...req.body });
    await post.save();
    req.flash('success', 'Post has been created successfully!');
    res.redirect('/admin/youtube/posts');
}));

router.get('/youtube/edit/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Youtube.findById(id);
    res.render('./admin/edityoutube', { post });
}));

router.put('/youtube/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Youtube.findByIdAndUpdate(id, { ...req.body });
    await post.save();
    req.flash('success', 'Changes has been deployed successfully!');
    res.redirect('/admin/youtube/posts');
}));

router.delete('/youtube/delete/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Youtube.findByIdAndDelete(id);
    req.flash('success', 'Youtube video has been deleted successfully');
    res.redirect('/admin/youtube/posts');
}));

router.get('/admin/blogs/posts', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const blogs = await Blog.find({});
    res.render('./admin/blogs', { blogs });
}));

router.post('/blog', upload.single('image'), isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { filename, path } = req.file;
    const blog = new Blog({ ...req.body, image: { filename, path } });
    await blog.save();
    req.flash('success', 'Post has been created successfully!');
    res.redirect('/admin/blogs/posts');
}));

router.get('/blog/edit/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.render('./admin/editblog', { blog });
}));

router.put('/blog/:id', upload.single('image'), isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (req.file) {
        await uploader.destroy(blog.image.filename);
        blog.image.filename = req.file.filename;
        blog.image.path = req.file.path;
    }
    blog.title = req.body.title;
    blog.description = req.body.description;
    await blog.save();
    req.flash('success', 'Content has been updated successfully!');
    res.redirect('/admin/blogs/posts')
}));

router.delete('/blog/delete/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    await uploader.destroy(blog.image.filename);
    req.flash('success', 'Content has been destroyed successfully!');
    res.redirect('/admin/blogs/posts')
}))




// Exporting the router
module.exports = router;