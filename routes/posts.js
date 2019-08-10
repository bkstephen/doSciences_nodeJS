const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
var mongoose = require('mongoose');

router.get('/', async (req, res) => {    
    const posts = await Post.find().sort('-date');
    
    res.render('posts', {posts: posts , auth: req.isAuthenticated()});    
});

router.post('/', (req, res) => {   
    res.redirect(`/posts/seepost/${req.body.postid}`,200,{id2:req.body.postid});    
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
        userName: req.user.name,
        content: req.body.textBox
    })
    post.save()
        .then(user => {
            req.flash('success_msg', 'Your post was submitted succesfully');
            res.redirect('/posts',200, { auth: req.isAuthenticated() });
        })
        .catch(err => console.error(err));
});

router.get('/seepost/:id', async (req,res)=>{
    //console.log(res.body.id2);
    const post = await Post.findById(req.params.id);
    const comments = await Comment.find({postId:req.params.id}).sort('-date');
    if (comments!=null){
        res.render('seepost',{post: post , user: req.user, comments:comments, auth: req.isAuthenticated()});
    }else{
        res.render('seepost',{post: post , user: req.user, comments:null, auth: req.isAuthenticated()});   
    }
});

router.get('/api/seepost/:id', async (req,res)=>{    
    const post = await Post.findById(req.params.id);
    const comments = await Comment.find({postId:req.params.id});
    const arr = [post, comments];
    res.send(arr);    
});

router.post('/seepost/:id', ensureAuthenticated, async (req, res) => {
    if(req.body.button=="addcomment"){
        console.log(req.body.postid);
        const comment = new Comment({
            userId: req.user.id,
            userName:req.body.userName,
            content: req.body.textBox,
            postId:  req.body.postid
        });        
        const post = await Post.findById(req.params.id);  
        comment.save()
            .then(user=>{res.redirect(`/posts/seepost/${req.params.id}`,200, { post:post, user: req.user, auth: req.isAuthenticated() })})
            .catch(err => console.error(err));
    }         
});

module.exports = router;