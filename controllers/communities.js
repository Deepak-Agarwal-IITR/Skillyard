const Community = require('../models/community')
const ExpressError = require('../utils/ExpressError')

module.exports.allCommunities = async (req,res)=>{
    const communities = await Community.find().populate('owner');
    res.render('communities/index',{communities,my:"no"});
}

module.exports.createNewCommunity = async (req,res)=>{
    const community = new Community(req.body.community)
    community.owner = req.user;
    community.members.push(req.user._id);
    await community.save();
    req.flash('success',"Created a new community")
    res.redirect(`/communities/${community._id}`)
}

module.exports.renderNewCommunityForm = (req,res)=>{
    res.render('communities/new')
}

module.exports.showCommunity = async(req,res)=>{
    const {id} = req.params;
    const community = await Community.findById(id).populate({
        path: 'posts',
        populate: {
            path: 'author' 
        }
    });
    res.render('communities/show',{community})
}

module.exports.renderEditCommunityForm = async(req,res)=>{
    const {id} = req.params;
    const community = await Community.findById(id);
    res.render('communities/edit',{community})
}

module.exports.editCommunity = async(req,res)=>{
    const {id} = req.params;
    const community = await Community.findByIdAndUpdate(id,{...req.body.community});
    
    await community.save();
    req.flash('success',"Updated community")
    res.redirect(`/communities/${id}`)
}

module.exports.deleteCommunity = async(req,res)=>{
    const { id } = req.params
    await Community.findByIdAndDelete(id)
    req.flash('success',"Deleted community")
    res.redirect('/communities')
}

module.exports.joinCommunity = async(req,res)=>{
    const {id} = req.params;
    const community = await Community.findById(id);

    community.members.push(req.user._id);
    await community.save();
    req.flash('success',`You have joined the community ${community.name}`);
    res.redirect(`/communities/${community._id}`)
}

module.exports.showMyCommunities = async(req,res)=>{
    const communities= await Community.find({$or:[{members: req.user._id},{owner: req.user._id}]}).populate('owner');
    
    res.render("communities/index", { communities,my:"yes"})
}

module.exports.trending = async (req, res) => {
    const {id} = req.params;
    await Community.findById(id).populate("posts").exec(function (err, community) {
        if (err) {
            throw new ExpressError('Post not found with this course', 404);
        }
        else {
            community.posts.sort((a, b) => (a.comments.length > b.comments.length) ? -1 : ((b.comments.length > a.comments.length) ? 1 : 0));
            res.render("communities/trending", { community });
        }
    })

}