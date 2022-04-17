const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')
const { isLoggedIn} = require('../middleware')
const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)

router.get('/logout',users.logout)

router.get('/bookmarks',isLoggedIn,catchAsync(users.bookmarks))

router.get("/ranking", isLoggedIn, catchAsync(users.ranking));
module.exports = router;