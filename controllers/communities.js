const Community = require('../models/community')

module.exports.allCommunities = async (req,res)=>{
    const communities = await Community.find();
    res.render('communities/index',{communities});
}

module.exports.createNewCommunity = async (req,res)=>{
    const community = new Community(req.body.community)
    community.owner = req.user;
    community.members.push({uid:req.user._id});
    await community.save();
    req.flash('success',"Created a new community")
    res.redirect("/communities")
}

module.exports.renderNewCommunityForm = (req,res)=>{
    res.render('communities/new')
}

module.exports.showCommunity = async(req,res)=>{
    const {id} = req.params;
    const community = await Community.findById(id).populate('posts');
    console.log(community)
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

    community.members.push({uid:req.user._id});
    await community.save();
    req.flash('success',`You have joined the community ${community.name}`);
    res.redirect(`/communities/${community._id}`)
}
