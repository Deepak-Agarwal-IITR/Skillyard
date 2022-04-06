var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    time1: {
        type: String,
        default: new Date().toISOString().slice(0, 10)
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likedby: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model("Comment", commentSchema);