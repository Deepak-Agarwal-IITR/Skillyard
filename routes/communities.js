const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const communities = require('../controllers/communities')
const {isLoggedIn,isCommunityOwner,isJoinedInCommunity,isAlreadyJoinedCommunity} = require('../middleware')

router.route('/')
    .get(catchAsync(communities.allCommunities))
    .post(isLoggedIn,catchAsync(communities.createNewCommunity))

router.route('/new')
    .get(isLoggedIn,communities.renderNewCommunityForm)

router.route('/:id')
    .get(catchAsync(communities.showCommunity))
    .put(isLoggedIn,isCommunityOwner,catchAsync(communities.editCommunity))
    .delete(isLoggedIn,isCommunityOwner,catchAsync(communities.deleteCommunity))

router.route('/:id/edit')
    .get(isLoggedIn,isCommunityOwner,catchAsync(communities.renderEditCommunityForm))

router.get('/:id/join', isLoggedIn, isAlreadyJoinedCommunity, catchAsync(communities.joinCommunity))

module.exports = router;