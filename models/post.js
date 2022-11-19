const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
    },
    photo:{
        type:String,
        required:true,
    },
    postedBy:{
        type: ObjectId,
        required:true,
        ref:"Users"
    },
    likes:[{type:ObjectId, ref:"Users"}],
    comments:[{
        text : String,
        postedBy:{type:ObjectId, ref:"Users"}
    }]
    
})

mongoose.model("Post", postSchema)