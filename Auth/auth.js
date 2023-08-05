const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')


module.exports = {

    userAuth:  (req,res,next)=>{
        
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null) return res.sendStatus(401)

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err, user)=>{
            
            if(err) return res.sendStatus(403)

           User.findById(user._id).then((userdata)=>{


            

            if(userdata.block)
            {
              return  res.json({blocked:true})
            }
            else
            {
              
                req.user = userdata
       
                next()
            }
          
            


           })
            
        })

        
    },

    adminAuth:  (req,res,next)=>{
       
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null) return res.sendStatus(401)

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err, user)=>{
            
            if(err) return res.sendStatus(403)

       


                req.user = user
       
                next()
           
          
            


            
        })

        
    }
}