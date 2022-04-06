const SubCommunity = require('../models/subcommunity')

module.exports.allSubCommunities = async (req,res)=>{
    const subcommunities = await SubCommunity.find();
    res.render('subcommunities/index',{subcommunities});
}

module.exports.createNewSubCommunity = async (req,res)=>{
    const subcommunity = new SubCommunity(req.body.subcommunity)
    subcommunity.owner = req.user;
    subcommunity.users.push({uid:req.user._id});
    await subcommunity.save();
    req.flash('success',"Created a new subcommunity")
    res.redirect("/subcommunities")
}

module.exports.renderNewSubCommunityForm = (req,res)=>{
    res.render('subcommunities/new')
}

module.exports.showSubCommunity = async(req,res)=>{
    const {id} = req.params;
    const subcommunity = await SubCommunity.findById(id).populate('users.uid');

    res.render('subcommunities/show',{subcommunity})
}

module.exports.renderEditSubCommunityForm = async(req,res)=>{
    const {id} = req.params;
    const subcommunity = await SubCommunity.findById(id);
    
    res.render('subcommunities/edit',{subcommunity})
}

module.exports.editSubCommunity = async(req,res)=>{
    const {id} = req.params;
    const subcommunity = await SubCommunity.findByIdAndUpdate(id,{...req.body.subcommunity});
    
    await subcommunity.save();
    req.flash('success',"Updated subcommunity")
    res.redirect(`/subcommunities/${id}`)
}

module.exports.deleteSubCommunity = async(req,res)=>{
    const { id } = req.params
    await SubCommunity.findByIdAndDelete(id)
    req.flash('success',"Deleted subcommunity")
    res.redirect('/subcommunities')
}
