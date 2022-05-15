const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const users_schema = new mongoose.Schema({
    // user_id: {
    //     type : String,
    //     unique : true,
    // },
    name: {
        type : String,
        required : true,
    },
    username: {
        type : String,
        required : true,
        unique : true,
    },
    phone: {
        type : Number,
        required : true,
        unique: true
    },
    // email: {
    //     type : String,
    //     unique: true
    // },
    password: {
        type : String,
    },
    pic: {
        type : String,
        default:"https://res.cloudinary.com/vishalkumar-sahu/image/upload/v1650207188/deafult_pic_tleags.jpg"
    },
    bio:{
        type: String,
        default: ""
    },
    followers : [{type : ObjectId, ref : "Users"}],
    following : [{type : ObjectId, ref:"Users"}]
})

mongoose.model("Users", users_schema)
