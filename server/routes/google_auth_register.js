const express = require("express");
const res = require("express/lib/response");
const app = express();
const router = express.Router();

const mongoose = require('mongoose');
require('../models/user.js');
const user = mongoose.model("Users");

require('../public/register/script');

var {google} = require('../public/register/script');

router.post('/auth/google', (req, res)=>{
        // var profile = googleUser.getBasicProfile();
        const profile = google;
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        console.log("hii bhai")
        user.findOne({user_id : profile.getId(), email : profile.getEmail()})
        .then((savedUser)=>{
            if(savedUser){
                res.status(201).redirect("/");
                return res.status(409).send("User already exist");
    
            }
    
            try{
    
                const phone = prompt("Enter your phone no..");
                const username = prompt("Enter your username ...")
    
                if(isNaN(phone) || phone == "" || phone.length != 10){
                    window.alert("Not a valid number.")
                    res.status(400).redirect('/');
                }
                else{
    
                    let val_username = /^[a-zA-Z ]+$/;
                    if (val_username.test(username) == false) {
                        if(username === ''){
                            alert("'Username' feild can't blank....");
                        }
                        else{
                            alert("Check the value filled in 'Username' feild")
                        }
                        res.status(400).redirect('/');
                    }
                    else{
    
                        const User = new user({
                            user_id : profile.getId(),
                            name : profile.getName(),
                            username,
                            phone,
                            email : profile.getEmail(),
                            profile_pic : profile.getImageUrl()
                        })
                
                        User.save()
                        .then(User=>{
                            res.send("User registered successfully !!");
            
                        })
                        .catch(err=>{
                            console.log(err);
                        })
    
    
                    }
                }
    
            }
            catch (error) {
                res.status(400).send(error);
            }
            
            
    
        })
        .catch(err=>{
            console.log(err);
        })
    
})

module.exports = router;