const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const mongoose = require('mongoose');
const User = mongoose.model('Users');

module.exports = (req, res, next)=>{
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).send("You must be logged in !");
    }
    
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, payload)=>{
        if(err){
            return res.status(401).send("You must be logged in !")
        }

        const {_id} = payload;
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
        

    })
}