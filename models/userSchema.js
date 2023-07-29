const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        min:2,
        max:50,
    },
    username:{
        type:String,
        required:true,
        unique:true,
        min:2,
        max:15,
    },
    email:{
        type:String,
        
        required:true,
        unique:true,
        max:50,
    },
    phone:{
        type:String,
        default:""
        
    },
    password:{
        type:String,
        
        min:8,
        
    },
    bio:{
        type:String,
        default:"1"
    },
    picture:{
        type:String,
        default:"https://cdn.dribbble.com/users/6142/screenshots/5679189/media/1b96ad1f07feee81fa83c877a1e350ce.png?compress=1&resize=400x300&vertical=center"
    },
    dp:{
        type:String,
        default:"dp1.jpg"
    },
    following:{
        type:Array,
        default:[],
    },
    followers:{
        type:Array,
        default:[],
    },
    requests:{
        type:Array,
        default:[]
    },
    location:{
        type:String,
        default:"",
    
    },
    block:{
        type:Boolean,
        default:false
    },
    verified:{
        type:Boolean,
        default:false
    },
    private:{
        type:Boolean,
        default:false
    },
    gAccount:{
        type:Boolean,
        default:false
    },
    stories:{
        type:[],
        default:[]
    },
    viewedProfile:{
        type:Number,
        default:0
    },
    impressions:{
        type:Number,
        default:0
    },
    lastverified:{
        type:Date,
        default:Date.now(),
    },
    createdOn:Date

    
  
   
})


module.exports = mongoose.model('users',userSchema)