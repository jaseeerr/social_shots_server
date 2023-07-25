const userHelper = require('../helpers/userHelper')
const jwt = require('jsonwebtoken')
const {nodeMailer} = require('../helpers/nodemailerHelper')
const {nodeMailer1} = require('../helpers/emailUpdateMailer')
const User = require("../models/userSchema")
const { response } = require('express')
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
    glogin:(req,res)=>{

        console.log(req.body)

        userHelper.glogin(req.body).then((response)=>{

            res.json(response)
        })

    },

    getUserdata:(req,res)=>{

        
        userHelper.getUserdata(req.params.id).then((data1)=>{
            
           
             const token = jwt.sign(  JSON.parse(JSON.stringify(data1)),process.env.ACCESS_TOKEN_SECRET)
            let data = {
                data1,
                own:false,
                token:token
                
            }
       
            if(req.user._id==data1._id)
            {
              data.own = true
            } 
          
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

            let own = false
            if(data.uid==req.user._id)
            {
                own = true
            }
            res.json({data, own})

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
        userHelper.verifyOtp(phone,otp,req.user._id).then((response)=>{
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

    updateEmail: async (req,res)=>{

      nodeMailer1(req.user.email,req.params.id).then((response)=>{
        res.json(response)
      })
     
     


    },

    updatebio:(req,res)=>{

        userHelper.updatebio(req.params.id,req.user._id).then((response)=>{

            res.json(response)
        })

    },

    updateactype:(req,res)=>{

        userHelper.updateactype(req.params.id,req.user._id).then((response)=>{
            res.json(response)
        })

    },

    follow:(req,res)=>{

        userHelper.follow(req.params.id,req.user.username).then((response)=>{

           
            res.json(response)
        })

    },

    unfollow:(req,res)=>{

        userHelper.unfollow(req.params.id,req.user.username).then((response)=>{

           
            res.json(response)
        })

    },

    cancelRequest:(req,res)=>{

        userHelper.cancelRequest(req.params.id,req.user._id).then((response)=>{

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
            

            if(err) return res.render('notVerified')
     
            User.findOneAndUpdate({email:user.email},{
                $set:{
                    verified:true
                }
            }).then(()=>{

                res.render('verified1')
            })
          


           
            
        })
    },

    verifyemail:(req,res)=>{

jwt.verify(req.params.id,process.env.ACCESS_TOKEN_SECRET,(err, user)=>{
            


            if(err)
            {    
                return res.render('notVerified')
            } 
            else
            {    
                User.findOneAndUpdate({email:user.email},{
                    $set:{
                        email:user.newMail
                    }
                }).then(()=>{
    
                    res.render('updatedEmail')
                })
            }
     
           
          


           
            
        })
    },

    uploadPost:(req,res)=>{

        userHelper.uploadPost(req.user,req.body).then((data)=>{

         

            res.json(data)




        })
    },

    reportPost:(req,res)=>{

        userHelper.reportPost(req.params.id,req.user._id).then((response)=>{

            res.json(response)
        })
    },

    deletePost:(req,res)=>{

        userHelper.deletePost(req.params.id).then((response)=>{

            res.json(response)
        })
    },

    myFeed:(req,res)=>{

        userHelper.myFeed(req.user._id).then((response)=>{

            res.json(response)
        })
    },

    likePost:(req,res)=>{

        userHelper.likePost(req.params.id,req.user._id).then((response)=>{

            res.json(response)


        })
    },

    unlikePost:(req,res)=>{

        userHelper.unlikePost(req.params.id,req.user._id).then((response)=>{

            res.json(response)


        })
    },

    shortList:(req,res)=>{


        userHelper.shortList(req.body).then((data)=>{
            res.json(data)
        })
    },

    shortList1:(req,res)=>{

console.log(req.body)
        userHelper.shortList1(req.body).then((data)=>{
            res.json(data)
        })
    },              
 
    comment:(req,res)=>{

        console.log(req.body)
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

        const data = {
            uid:req.user._id,
            pid:req.body.id,
            comment:req.body.newComment,
            date:`${currentDay} ${month[currentMonth]} ${currentYear}`
     
        }

        console.log(data)
        console.log("bruh");

        userHelper.comment(data).then((response)=>{

            res.json(response)
        })
    },

    deletecomment:(req,res)=>{

        console.log(req.body);
        userHelper.deletecomment(req.body).then((response)=>{

            res.json(response)
        })
    }


}