const express = require("express");
const app = express();
const router = express.Router();

const mongoose = require('mongoose');
require('../models/user.js');
const user = mongoose.model("Users");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)

const requireLogin = require('../middleware/requirelogin');
require('./home');

app.use(express.static(__dirname + '/public/'));


// app.set('views', 'views/');
// app.set('view engine', 'ejs');

// router.get('/signup', (req, res)=>{
//     res.render('signup.ejs');
// })

router.post('/signup', (req, res)=>{
    const {name, username, phone, password} = req.body;
    if(!name || !username || !phone || !password){
        return res.status(422).json({error:"Invalid entry !"});
    }

    client
            .verify
            .services(process.env.SERVICE_ID)
            .verifications
            .create({
                to: `+91${phone}`,
                channel: 'sms' 
            })
            .then(data => {
                console.log(localStorage.setItem("phone", phone));
            }) 
    

    user.findOne({phone : phone, username : username})
    .then((savedUser)=>{
        if(savedUser){
            res.status(201).redirect("/");
            return res.status(409).json({error:"User already exist !"});

        }

        try{

            bcrypt.hash(password, 12)
            .then(hashedpassword =>{
                const User = new user({
                    name,
                    username,
                    phone : phone,
                    password : hashedpassword
                })
        
                User.save()
                .then(User=>{
                    res.status(200).json({message:"Otp send !"});

                    // res.redirect('/verifyOtp')
                })
                .catch(err=>{
                    console.log(err);
                })
            })
        }
        catch (error) {
            res.status(400).send(error);
        }
        
        

    })
    .catch(err=>{
        console.log(err);
    })


})

router.post('/signin', (req, res)=>{
    const {phone, password} = req.body;
    if(!phone || !password){
        res.status(422).json({error:"Please add phone or password !"});
    }

    user.findOne({phone : phone})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Please signup !!"});
        }

        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.status(200).json({message:"Successfully signedin !!"})
                // res.redirect('/home');
                const token = jwt.sign({_id:savedUser._id}, process.env.JWT_SECRET);
                const {_id, name, username, followers, following, pic, bio} = savedUser
                res.json({token, user : {_id, name, username, followers, following, pic, bio}});
            }
            else{
                return res.status(422).json({error:"Invalid Cerenditals !!"});
            }
        })
        .catch(err=>{
            console.log(err);
        })


    })



})

router.post('/verifyOtp', (req, res)=>{
    const {otp ,phone} = req.body;

    user.findOne({phone : phone})
    .then((saved)=>{
        if(saved){
            client
                .verify
                .services(process.env.SERVICE_ID)
                .verificationChecks
                .create({
                    to: `+91${phone}`,
                    code: otp
                })
                .then(data => {
                    if (data.status === "approved") {
                        res.status(200).json({message:"Otp verified successfully !"});
                        // res.redirect('/')
                    }
                    else{
                        user.deleteOne({phone : phone});
                        res.status(200).json({error:"Otp not verified successfully !"});
                    }
                })
        }
        else{
            res.redirect('/signup')
        }
    })
    



})

router.post('/forgettenPassword', (req, res)=>{
    const {phone} = req.body;
    if(!phone){
        return res.status(422).json({error:"Invalid entry !"});
    }
    
    user.findOne({phone : phone})
    .then((savedUser)=>{
        if(savedUser){

            client
                .verify
                .services(process.env.SERVICE_ID)
                .verifications
                .create({
                    to: `+91${phone}`,
                    channel: 'sms' 
                })
                .then(data => {
                    console.log(localStorage.setItem("phone", phone));
                }) 



                res.status(200).json({message:"Otp send !"});
        }
        else{
            return res.status(409).json({error:"Please register !!"});
        }

    })
    .catch(err=>{
        console.log(err);
    })


})

router.post('/verifyForgetPasswordOtp', (req, res)=>{
    const {otp ,phone} = req.body;

    user.findOne({phone : phone})
    .then((saved)=>{
        if(saved){
            client
                .verify
                .services(process.env.SERVICE_ID)
                .verificationChecks
                .create({
                    to: `+91${phone}`,
                    code: otp
                })
                .then(data => {
                    if (data.status === "approved") {
                        res.status(200).json({message:"Otp verified successfully !"});
                        // res.redirect('/')
                    }
                    else{
                        res.status(200).json({error:"Otp not verified successfully !"});
                    }
                })
        }
        else{
            res.redirect('/signup')
        }
    })
    



})

router.post('/changePassword', (req, res)=>{
    const {password, phone} = req.body;
    if(!password){
        return res.status(422).json({error:"Password not provided !"});
    }

    user.findOne({phone : phone})
    .then((savedUser)=>{
        if(savedUser){
            try{

                bcrypt.hash(password, 12)
                .then(hashedpassword =>{
                    // user.updateOne({phone}, {$set : {password : hashedpassword}})
                    // res.status(200).json({message:"Password changed successfully !"});

                    user.updateOne({ phone: phone }, { password: hashedpassword }, function(
                        err,
                        result
                      ) {
                        if (err) {
                            return res.status(200).send(err);
                        } else {
                            res.status(200).json({message:"Password changed successfully !"});
                        }
                      });


                })
            }
            catch (error) {
                res.status(400).send(error);
            }

        }

    })
    .catch(err=>{
        console.log(err);
    })


})



module.exports = router;