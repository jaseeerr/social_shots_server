const userHelper = require('../helpers/userHelper')
const jwt = require('jsonwebtoken')
const {nodeMailer} = require('../helpers/nodemailerHelper')
const User = require("../models/userSchema")
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const SSID = process.env.SSID


module.exports = {


    test: async (req,res)=>{


  

       
    },

    home:(req,res)=>{

        res.send("HEY HOME REACHED")
    },
    signup:(req,res)=>{


userHelper.singup(req.body).then((response)=>{

    res.json(response)

})
    },

    login:(req,res)=>{

        try {

            userHelper.login(req.body).then((response)=>{
 
          let data 
          if(response.success)
          {
           let name = response.data.username
           response.data.password = ""
           const data1 = JSON.parse(JSON.stringify(response.data));
           const token = jwt.sign(data1,process.env.ACCESS_TOKEN_SECRET)
           if(response.data.verified)
           {
            data = {
                name:name,
                success:true,
                token:token
            }
           }
           else
           {
            nodeMailer(response.data.email)
              data = {
                notVerified:true
              }
           }
            
           
          }
          else if(response.baduser)
          {
            data = {
               baduser:true
           }
          }
          else if(response.badpass)
          {
           data = {
               badpass:true
           }
          }
          else if(response.blocked)
          {
           data = {
               blocked:true
                }
          }
          
                          res.json(data)
            })
            
        } catch (error) {

            res.json({error:true})
            
        }
        
    },

    getUserdata:(req,res)=>{

        userHelper.getUserdata(req.params.id).then((data1)=>{

            let data = {
                data1,
                own:false
                
            }
       
            if(req.user.username==req.params.id)
            {
              data.own = true
            }
          
            console.log(data)
            res.json(data)




        })
    },

    myData:(req,res)=>{

        userHelper.myData(req.user._id).then((data)=>{

            res.json(data)

        })
    },

    getMyPosts:(req,res)=>{



        userHelper.getMyPosts(req.params.id).then((data)=>{

            res.json(data)
        })
    },

    getOnePost:(req,res)=>{

        userHelper.getOnePost(req.params.id).then((data)=>{

            res.json(data)

        })

    },

    checkUsername:(req,res)=>{

        const uname = req.params.id
        if(uname.length < 4)
        {
            res.json({badname:true})
        }
        else
        {
            userHelper.checkUsername(uname).then((badname)=>{

                res.json({badname:badname})


            })
        }

      
    },

    sentOtp:(req,res)=>{


        userHelper.sentOtp(req.params.id).then((response)=>{
            res.json(response)


        })



    },

    verifyOtp:(req,res)=>{

        const {phone, otp} = req.query
        console.log(phone,otp,req.user._id)
        userHelper.verifyOtp(phone,otp,req.user._id).then((response)=>{
            console.log("FF IT WORKED")
            res.json(response)
        })
     

    },

   
    updateUsername:(req,res)=>{
        try {

            
        userHelper.updateUsername(req.user._id,req.params.id).then((response)=>{

            res.json({success:response})

        })
            
        } catch (error) {

            res.json({error:true})
            
        }

    },

    follow:(req,res)=>{
        console.log("FOLLoWE")

        userHelper.follow(req.params.id,req.user.username).then((response)=>{

           
            res.json(response)
        })

    },

    unfollow:(req,res)=>{
        console.log("UNNNNFOLLoWE")

        userHelper.unfollow(req.params.id,req.user.username).then((response)=>{

           
            res.json(response)
        })

    },
    search: async (req,res)=>{

        const { query } = req.query;

      

  try {
    // Perform search using Mongoose query
    const searchResults = await User.find({ username: { $regex: query, $options: 'i' } });


    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }


    },
    getAllPosts:(req,res)=>{

        userHelper.getAllPosts().then((data)=>{
            data = data.reverse()
            res.json(data)
        })

    },

    updateDp:(req,res)=>{

        userHelper.updateDp(req.user._id,req.params.id).then((response)=>{

            res.json({success:response})

        })
    },

    verifyuser:(req,res)=>{

        jwt.verify(req.params.id,process.env.ACCESS_TOKEN_SECRET,(err, user)=>{
            

            if(err) return res.render('verified')
     
            User.findOneAndUpdate({email:user.email},{
                $set:{
                    verified:true
                }
            }).then(()=>{

                res.render('verified1')
            })
          


           
            
        })
    },

    uploadPost:(req,res)=>{

        userHelper.uploadPost(req.user,req.body).then((data)=>{

         

            res.json(data)




        })
    }


}