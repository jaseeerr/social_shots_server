const mongoose = require('mongoose')
const Schema = mongoose.Schema

const visitorSchema = new Schema({
  username:String,
  browser: String,
  platform: String,
  mobile: String,
  location: String,
  ip: String,
  country:String,
  region:String,
  timezone:String,
  timeStamp:Date
   
})


module.exports = mongoose.model('visitors',visitorSchema)