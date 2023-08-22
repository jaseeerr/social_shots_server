const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
  uid: String,
  username: String,
  dp: String,
  picture: String,
  reported: {
    type: [],
    default: []
  },
  date: {type:Date,default:Date.now},
  expire: {
    type: Date,
    default: function() {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
  },
  views:{
    type:Array,
    default:[]
  }
});

module.exports = mongoose.model('stories', storySchema);
