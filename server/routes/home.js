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

const requireLogin = require('../middleware/requirelogin');

app.use(express.static(__dirname + '/public/'));


// app.set('views', 'views/');
// app.set('view engine', 'ejs');

// router.get('/home', (req, res)=>{
//     res.render('home.ejs');
// })


module.exports = router;