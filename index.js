const express = require("express");
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require("passport-local")
const bodyparser = require('body-parser')
const methodoverride = require("method-override")
const session = require('express-session')

const User = require("./models/user")
const ExpressError = require('./utils/ExpressError')
const userRoutes = require('./routes/users')
const communityRoutes = require('./routes/communities')
const postRoutes = require('./routes/posts')
const commentRoutes = require('./routes/comments')
const flash = require("connect-flash");

mongoose.connect('mongodb://localhost:27017/skillyard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected")
})

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
app.use('/communities/:id/posts',postRoutes)
app.use('/communities/:id/posts/:postid/comments',commentRoutes)

app.get('/',(req,res)=>{
    res.render('landing');
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong';
    res.status(statusCode).render('error',{err});
})

app.listen(3000, () => {
    console.log("Listening on 3000")
})