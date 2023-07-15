const mongoose = require('mongoose')
const Schema = mongoose.Schema

const friend = new Schema({
   fname:String,
   lname:String,
   profilePicture:String,
   occupation:String,
   location:String
    
  
   
})