const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    postId:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;