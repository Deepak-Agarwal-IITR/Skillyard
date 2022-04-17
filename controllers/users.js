const User = require('../models/user');
const Community = require('../models/community')

module.exports.renderRegister = (req, res) => {
    res.render('register')
}

module.exports.register = async(req,res)=>{
    try{
        const {username,password,enrollmentNo} = req.body;
        const user = new User({username,enrollmentNo});
        
        const registeredUser = await User.register(user, password)
        await registeredUser.save();
        
        req.login(registeredUser,err=>{
            if (err) return next(err);
            req.flash('success', 'Welcome to Skillyard')
            res.redirect('/communities')
        })
        
    }catch(e){
        req.flash('error',e.message)
        res.redirect('register')
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('login')
}
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/communities'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}
module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('success',"Goodbye!")
    res.redirect('/');
}

module.exports.bookmarks = async (req,res)=>{
    const user = await User.findById(req.user._id).populate({
        path: 'bookmarks',
        populate: {
            path: 'community' 
        }
    })
    const posts = user.bookmarks
    res.render('bookmarks',{posts})
}

module.exports.ranking = async (req, res) => {
    await User.findById(req.user._id).exec(async (err, currentUser) => {
        await User.find().exec(function (err, currentUsers) {
            currentUsers.sort((a, b) => (a.posts.length > b.posts.length) ? -1 : ((b.posts.length > a.posts.length) ? 1 : 0));
            res.render("ranking", { currentUsers, i: 1 });
        })
    })
}