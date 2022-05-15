const express = require("express");
const app = express();
const router = express.Router();

const mongoose = require('mongoose');

const requirelogin = require('../middleware/requirelogin')
const Post = mongoose.model('Post')
const User = mongoose.model('Users')

router.get('/user/:id', requirelogin, (req, res)=>{
    User.findOne({_id : req.params.id})
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy", "_id name username pic bio")
        .exec((err, posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user, posts})
        })
    })
    .catch(err=>{
        return res.status(404).json({error:"User not found !!"})
    })
})


router.put('/follow', requirelogin, (req, res)=>{
    User.findByIdAndUpdate(req.body.followId, {
        $push:{followers:req.user._id}
    }, {
        new : true
    }, (err, result) =>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id,{
            $push:{following : req.body.followId}
        }, {new : true}).select("-password")
        .then(result =>{
            res.json(result)
        })
        .catch(err =>{
            return res.status(422).json({error : err})
        })

    })
})

router.put('/unfollow', requirelogin, (req, res)=>{
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull:{followers:req.user._id}
    }, {
        new : true
    }, (err, result) =>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id,{
            $pull:{following : req.body.unfollowId}
        }, {new : true}).select("-password")
        .then(result =>{
            res.json(result)
        })
        .catch(err =>{
            return res.status(422).json({error : err})
        })

    })
})

router.post('/profilePic', requirelogin, (req, res)=>{
    const {url} = req.body
    // console.log(req.user)
    if(!url){
        return res.status(422).json({error:"Please add the Profile pic"})
    }

    // req.user.password = undefined
    User.findByIdAndUpdate(req.user._id,{
        $set:{pic : url}
    }, {new : true}).select("-password")
    .then(result =>{
        res.json(result)
    })
    .catch(err =>{
        return res.status(422).json({error : err})
    })
})

router.get('/bio', requirelogin, (req, res)=>{
    User.find({_id: {$in:req.user._id}})
    .populate("bio", "_id name username pic bio")
    .then(user_bio =>{
        res.send({user_bio});
    })
    .catch(err =>{
        console.log(err);
    })
})

router.post('/bioset', requirelogin, (req, res)=>{
    const {bio} = req.body
    // console.log(req.user)
    if(!bio){
        return res.status(422).json({error:"Please add Bio"})
    }

    // req.user.password = undefined
    User.findByIdAndUpdate(req.user._id,{
        $set:{bio}
    }, {new : true}).select("-password")
    .then(result =>{
        res.json(result)
    })
    .catch(err =>{
        return res.status(422).json({error : err})
    })
})


module.exports = router