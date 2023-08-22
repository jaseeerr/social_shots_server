const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notificationSchema = new Schema({
   
    from:String,
    pid:String,
    to:String,
    type:String,
  
    img:String,
    date:{
        type:Date,
        default:Date.now
    },
    
    seen: { type: Boolean, default: false }
    
  
   
})


module.exports = mongoose.model('notifications',notificationSchema)