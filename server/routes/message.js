const express = require("express");
const app = express();
const router = express.Router();

const mongoose = require('mongoose');
const requirelogin = require("../middleware/requirelogin");
const Message = require('../models/message');
// const Message = mongoose.model("Message");

// add
router.post('/chat/messages/',requirelogin, async (req, res)=>{
    // console.log(req.body);
    const message = {
        conversationId : req.body.conversationId,
        sender : req.body.sender,
        text : req.body.text,
        
    };

    const newMessage = new Message(message)

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err)
    }

})

//get
router.get('/chat/messages/:conversationId',requirelogin, async (req, res)=>{

    try {
        const messages = await Message.find({
            conversationId : req.params.conversationId,
        })
        res.status(200).json(messages)

    } catch (err) {
        res.status(500).json(err)
    }

})







module.exports = router;