const Community = require('../models/community')
const Post = require('../models/post')
const User = require('../models/user')

module.exports.renderPostForm = (req, res) => {
    const {id } = req.params
    res.render("posts/new",{id })
};

module.exports.createPost = async (req, res) => {
    const { id  } = req.params
    const community = await Community.findById(id);
    const post = new Post(req.body.post)
    post.author = req.user;
    community.posts.push(post)
    await post.save();
    await community.save();
    req.flash('success', "Added Post")
    res.redirect(`/communities/${id}/posts`)
};

module.exports.bookmarkPost = async (req, res) => {
    const { id,postid } = req.params
    const post = await Post.findById(postid);
    const user = await User.findById(req.user._id)

    const isBookmarked = user.bookmarks.includes(post._id);
    if(!isBookmarked){
        user.bookmarks.push(post._id);
    } else {
        user.bookmarks.pull(post._id);
    }
    await post.save();
    await user.save();
    res.redirect(`/communities/${id}/posts`);
};

module.exports.renderEditPostForm = async(req, res) => {
    const { id  ,postid } = req.params
    const foundPost = await Post.findById(postid)
    res.render("posts/edit", { id ,post:foundPost })
};

module.exports.editPost = async (req, res) => {
    const { id, postid} = req.params
    const post = await Post.findByIdAndUpdate(postid, { ...req.body.post });
    await post.save()
    req.flash('success', "Updated post")
    res.redirect(`/communities/${id}/posts`)
};

module.exports.deletePost = async (req, res) => {
    const { id ,postid     } = req.params
    await Community.findByIdAndUpdate(id,{$pull:{posts:postid}});
    await Post.findByIdAndDelete(postid);
    req.flash('success', "Deleted Post")
    res.redirect(`/communities/${id}/posts`)
};