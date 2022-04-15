const Community = require('./models/community')
const Comment = require('./models/comment')
const Post = require('./models/post')
const catchAsync = require("./utils/catchAsync");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You musted be signed in')
        return res.redirect('/login')
    }
    next();
}

module.exports.isCommunityOwner = catchAsync(async(req,res,next) => {
    const {id} = req.params;
    const community = await Community.findById(id);
    if(!community.owner.equals(req.user._id)){
        req.flash('error',"You don't have permissions")
        return res.redirect(`/communities/${id}`);
    }
    next();
})

module.exports.isJoinedInCommunity = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const community = await Community.findById(id);
    if(!((community.members.filter(user => user.toString() === req.user._id.toString()).length > 0) || community.owner.equals(req.user._id))){
        req.flash('error', "You are not a member of the community.")
        return res.redirect(`/communities/${id}`);
    }
    next();
})

module.exports.isCommentAuthor = catchAsync(async(req,res,next) => {
    const {id} = req.params;
    const comment = await Comment.findById(id);
    if(!comment.author.equals(req.user._id)){
        req.flash('error',"You don't have permissions")
        return res.redirect(`/communities/${id}`);
    }
    next();
})

module.exports.isPostAuthor = catchAsync(async(req,res,next) => {
    const {id} = req.params;
    const post = await Post.findById(id);
    if(!post.author.equals(req.user._id)){
        req.flash('error',"You don't have permissions")
        return res.redirect(`/communities/${id}`);
    }
    next();
})