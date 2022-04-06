var mongoose = require('mongoose');

var communitySchema = new mongoose.Schema({
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
    subCommunities:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCommunity"
    }],
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("Community", communitySchema);
