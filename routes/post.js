const express = require("express");
const app = express();
const router = express.Router();

const mongoose = require('mongoose');

const requirelogin = require('../middleware/requirelogin')
const Post = mongoose.model('Post')

// app.set('views', 'views/');
// app.set('view engine', 'ejs');

// router.get('/signup', (req, res)=>{
//     res.render('signup.ejs');
// })


router.get('/allpost', requirelogin, (req, res)=>{
    Post.find({postedBy: {$nin:req.user.following}})
    .populate("postedBy", "_id name username pic")
    .populate("comments.postedBy", "_id name username")
    .then(posts =>{
        res.send({posts});
    })
    .catch(err =>{
        console.log(err);
    })
})

router.get('/followingPost', requirelogin, (req, res)=>{
    // if postedby in following
    Post.find({postedBy: {$in:req.user.following}})
    .populate("postedBy", "_id name username pic")
    .populate("comments.postedBy", "_id name username")
    .then(posts =>{
        res.send({posts});
    })
    .catch(err =>{
        console.log(err);
    })
})

// router.get('/createpost', (req, res)=>{
//     res.render('create_post.ejs');
// })
router.post('/createpost', requirelogin, (req, res)=>{
    const {caption, url} = req.body
    // console.log(req.user)
    if(!url){
        return res.status(422).json({error:"Please add all the feilds"})
    }

    req.user.password = undefined
    const post = new Post({
        caption : caption,
        photo : url,
        postedBy: req.user,
    })
    post.save().then(result =>{
        res.send({post:result})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get('/mypost', requirelogin, (req, res)=>{
    Post.find({postedBy : req.user._id})
    .populate("postedBy", "_id name username pic bio" )
    .then(mypost =>{
        res.send({mypost})
    })
    .catch(err =>{
        console.log(err);
    })
})

router.put('/like', requirelogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postID, {
        $push:{likes:req.user._id}
    }, {
        new : true
    })
    .populate("comments.postedBy", "_id name username pic")
    .populate("postedBy", "_id name username pic")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            // console.log(result)
            res.json(result)
        }
    })
})

router.put('/unlike', requirelogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postID, {
        $pull:{likes:req.user._id}
    }, {
        new : true
    })
    .populate("comments.postedBy", "_id name username pic")
    .populate("postedBy", "_id name username pic")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comment', requirelogin, (req, res)=>{
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postID, {
        $push:{comments: comment}
    }, {
        new : true
    })
    .populate("comments.postedBy", "_id name username pic")
    .populate("postedBy", "_id name username pic")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            // console.log(result)
            res.json(result)
        }
    })
})


router.delete('/deletepost/:postID', requirelogin, (req, res)=>{
    Post.findOne({_id : req.params.postID})
    .populate("postedBy", "_id")
    .exec((err, post) =>{
        if(err || !post){
            return res.status(422).json({error: err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result =>{
                res.json(result)
            })
            .catch(err =>{
                console.log(err)
            })
        }
    })
})


module.exports = router