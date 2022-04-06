const express = require("express");
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const Localstrategy = require("passport-local")
const bodyparser = require('body-parser')
const methodoverride = require("method-override")

const User = require("./models/user")
const Comment = require("./models/comment")
const Community = require("./models/community")
const Post = require("./models/post")
const SubCommunity = require("./models/subcommunity");

// const communityLists = require("./data/data.json");
const userRoutes = require('./routes/users')
const communityRoutes = require('./routes/communities')
const flash = require("connect-flash");

mongoose.connect('mongodb://localhost:27017/db', { useNewUrlParser: true, useUnifiedTopology: true })
const AppError = require("./AppError");

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));

const sessionConfig = {
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    //  secure: true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user;
    next();   
})



app.use('/',userRoutes)
app.use('/communities',communityRoutes)

app.get('/',(req,res)=>{
    res.render('home');
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong';
    res.status(statusCode).render('error',{err});
})

app.listen(8080, () => {
    console.log("Listening on 8080")
})