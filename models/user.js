var mongoose = require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },  
    enrollmentNo:{
        type: Number,
        required: true
    },
    title:{
        type: String,
        enum:[]
    },
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    communities:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    }],
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);
module.exports =mongoose.model("User",UserSchema);