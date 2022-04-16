const express = require('express')
const router = express.Router({mergeParams:true});

const { isLoggedIn,isJoinedInCommunity,isPostAuthor } = require('../middleware')
const posts = require("../controllers/posts");
const catchAsync = require('../utils/catchAsync')


router.get("/new", isLoggedIn,isJoinedInCommunity, posts.renderPostForm)
router.route("/")
    .post(isLoggedIn, isJoinedInCommunity, catchAsync(posts.createPost))

router.route('/:postid')
    .get(isLoggedIn, catchAsync(posts.showComments))
    .put(isLoggedIn, isJoinedInCommunity, isPostAuthor, catchAsync(posts.editPost))
    .delete(isLoggedIn, isJoinedInCommunity, isPostAuthor, catchAsync(posts.deletePost))

router.get('/:postid/edit', isLoggedIn,isJoinedInCommunity,isPostAuthor, catchAsync(posts.renderEditPostForm))
router.post('/:postid/bookmark', isLoggedIn,isJoinedInCommunity,catchAsync(posts.bookmarkPost))
module.exports = router;