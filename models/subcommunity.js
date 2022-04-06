var mongoose = require('mongoose');

var subcommunitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    parent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    }
});

module.exports = mongoose.model("SubCommunity", subcommunitySchema);
