const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    postType:{
        type:String,
        required:true
    },
    uid:String,
    username:String,
    location:String,
    caption:{
        type:String,
        default:""
    },
    profilePicture:String,
    picture:String,
    likes:{
        type:[],
        default:[]
    },
    comments:{
        type:[],
        default:[]
    },
    
  
   
})


module.exports = mongoose.model('posts',postSchema)