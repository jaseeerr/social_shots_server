const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storySchema = new Schema({
   
    uid:String,
    username:String,
   
    profilePicture:String,
    picture:String,
   
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


module.exports = mongoose.model('stories',storySchema)