const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
   
    sender:String,
    receiver:String,
    content:String,
    time:{
        type:String,
        default:function() {
            const now = new Date();
            let time = now.getHours() + ":" + now.getMinutes()
            return time
        }
    },
    date:{
        type:Date,
        default:Date.now()
    },
    seenByReceiver: { type: Boolean, default: false }
    
  
   
})


module.exports = mongoose.model('messages',messageSchema)