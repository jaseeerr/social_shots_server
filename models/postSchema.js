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
    reported:{
        type:[],
        default:[]
    },
    private:{
        type:Boolean,
        default:false
    },
    date:String
    
  
   
})


module.exports = mongoose.model('posts',postSchema)