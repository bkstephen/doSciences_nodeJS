const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Post = require('../models/Post');
var mongoose = require('mongoose');

router.get('/', async (req, res) => {    
    const posts = await Post.find().sort('-date');
    
    res.render('posts', {posts: posts , auth: req.isAuthenticated()});    
});

router.get('/api', async (req, res) => {    
    const posts = await Post.find().sort('-date');    
    res.send(posts);    
});

router.get('/createpost', ensureAuthenticated, (req, res) => {
    res.render('createpost', { user: req.user, auth: req.isAuthenticated() });
});

router.post('/createpost', ensureAuthenticated, (req, res) => {
    const post = new Post({
        name: req.body.postName,
        userId: req.user._id,
        content: req.body.textBox
    })
    post.save()
        .then(user => {
            req.flash('success_msg', 'Your post was submitted succesfully');
            res.redirect('/posts', { auth: req.isAuthenticated() });
        })
        .catch(err => console.error(err));
});

module.exports = router;