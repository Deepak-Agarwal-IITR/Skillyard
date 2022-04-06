const express = require('express')
const router = express.Router({mergeParams:true});

const { isLoggedIn,isJoinedInCommunity,isCommentAuthor } = require('../middleware')
const comments = require("../controllers/comments");
const catchAsync = require('../utils/catchAsync')


router.get("/new", isLoggedIn,isJoinedInCommunity, comments.renderCommentForm)
router.route("/")
    .post(isLoggedIn, isJoinedInCommunity, catchAsync(comments.createComment))

router.route('/:commentid')
    .get(isLoggedIn, isJoinedInCommunity, catchAsync(comments.likeComment))
    .put(isLoggedIn, isJoinedInCommunity, isCommentAuthor, catchAsync(comments.editComment))
    .delete(isLoggedIn, isJoinedInCommunity, isCommentAuthor, catchAsync(comments.deleteComment))

router.get('/:commentid/edit', isLoggedIn,isJoinedInCommunity,isCommentAuthor, catchAsync(comments.renderEditCommentForm))

module.exports = router;