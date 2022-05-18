const express = require("express");
const app = express();
const router = express.Router();

const mongoose = require('mongoose');
const requirelogin = require("../middleware/requirelogin");
// const Conversation = require('../models/conversation');
const Conversation = mongoose.model("Conversation");

// new conversation
router.post('/chat/conversation/',requirelogin, async (req, res) =>{
    console.log(req.body)
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });
    
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
})


// get conversation of a user
router.get('/chat/conversation/:userId', requirelogin, async (req, res)=>{
    try {
        const conversation = await Conversation.find({
            members : { $in : [req.params.userId]},
        })
        res.status(200).json(conversation)
    } catch (err) {
        res.status(500).json(err);
    }
})

// get converstion includes two userId
router.get("/chat/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation)
    } catch (err) {
      res.status(500).json(err);
    }
});



module.exports = router;