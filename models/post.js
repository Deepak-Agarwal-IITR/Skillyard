var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    time1: {
        type: String,
        default: new Date().toISOString().slice(0, 10)
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    anonymouslyAsked: {
        type: Boolean,
        default: false
    },
    likedby: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

//setupsvhema to a model
module.exports = mongoose.model("Post", postSchema);