const Comment = require('../models/comment')
const Post = require('../models/post')

module.exports.renderCommentForm = (req, res) => {
    const {id,postid} = req.params
    res.render("comments/new",{id,postid})
};

module.exports.createComment = async (req, res) => {
    const { id,postid } = req.params
    const post = await Post.findById(postid);
    const comment = new Comment(req.body.comment)
    comment.author = req.user;
    post.comments.push(comment)
    await comment.save();
    await post.save();
    req.flash('success', "Added Comment")
    res.redirect(`/communities/${id}/posts/${postid}`)
};

module.exports.likeComment = async (req, res) => {
    const { id, postid, commentid } = req.params
    const comment = await Comment.findById(commentid);

    const isLiked = comment.likedBy.includes(req.user._id);
    
    if(!isLiked){
        comment.likedBy.push(req.user);
    } else {
        comment.likedBy.pull(req.user);
    }
    await comment.save();
    res.redirect(`/communities/${id}/posts/${postid}/comments`);
};

module.exports.renderEditCommentForm = async(req, res) => {
    const { id, postid,commentid } = req.params
    const foundComment = await Comment.findById(commentid)
    res.render("comments/edit", { id, postid,comment:foundComment })
};

module.exports.editComment = async (req, res) => {
    const { id, postid, commentid } = req.params
    const comment = await Comment.findByIdAndUpdate(commentid, { ...req.body.comment });
    await comment.save()
    req.flash('success', "Updated comment")
    res.redirect(`/communities/${id}/posts/${postid}/comments`)
};

module.exports.deleteComment = async (req, res) => {
    const { id, postid, commentid } = req.params
    await Post.findByIdAndUpdate(postid,{$pull:{comments:commentid}});
    await Comment.findByIdAndDelete(commentid);
    req.flash('success', "Deleted Comment")
    res.redirect(`/communities/${id}/posts/${postid}/comments`)
};