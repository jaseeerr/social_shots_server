const User = require('../models/userSchema')
const argon = require('argon2')
const Post = require('../models/postSchema')
const {nodeMailer} = require('../helpers/nodemailerHelper')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const SSID = process.env.SSID
const twilio = require('twilio');



module.exports = {

    singup:(userdata)=>{

        return new Promise((resolve, reject) => {

            argon.hash(userdata.password).then((pass)=>{

              
                    const user = new User({
                      username: userdata.name.toLowerCase(),
                      email: userdata.email,
                   
                      password: pass,
                      picture: null,
                      liked: [],
                      products: []
                    });
                  
                    user.save().then(() => {

                        nodeMailer(userdata.email)
                            resolve({success:true})
                    

                          

                      
                    }).catch((error) => {

                        if (error.name === 'MongoServerError' && error.code === 11000) {
                            // Duplicate key error
                            resolve({ exuser: true })
                            // throw new Error('Email already exists.');
                          } else {
                          
                            resolve({ success: false });

                          }

                       
                      
                      });
               
                  
    
                             
    
                
            })
            
            
        })

        


    },


    login:(udata)=>{

        return new Promise((resolve, reject) => {
            
            User.findOne({email:udata.email}).then((data)=>{

                if(data)
                {

                    argon.verify(data.password,udata.password).then((pass)=>{

                        if(pass)
                        {
                            resolve({success:true,data})
                        }
                        else
                        {
                            resolve({badpass:true})
                        }
                    })
                }
                else
                {
                    User.findOne({username:udata.email}).then((data1)=>{

                        if(data1)
                        {
        
                            argon.verify(data1.password,udata.password).then((pass)=>{
        
                                if(pass)
                                {
                                    const data = data1
                                    resolve({success:true,data})
                                }
                                else
                                {
                                    resolve({badpass:true})
                                }
                            })
                        }
                        else
                        {
                            resolve({baduser:true})
                        }

                    

                    })

                   
                }
            })
        })
    },


    getUserdata:(id)=>{

        return new Promise((resolve, reject) => {
            
            User.findOne({username:id}).then((data)=>{

            
                
                resolve(data)
              

            })
        })
    },

    myData:(id)=>{

        return new Promise((resolve, reject) => {
            User.findById(id).then((data)=>{
                resolve(data)
            })
        })

    },

    getMyPosts:(id)=>{
        return new Promise((resolve, reject) => {

 
            Post.find({username:id}).then((data)=>{
                data = data.reverse()
                resolve(data)
            })
            

        })
    },

    getOnePost:(id)=>{
        return new Promise((resolve, reject) => {
            
            Post.findById(id).then((data)=>{
                resolve(data)
            })
        })
    },

    checkUsername:(uname)=>{
        return new Promise((resolve, reject) => {
            let badname = false
            
            User.find({username:uname}).then((response)=>{

                if(response.length!=0)
                {
                    badname = true
                    resolve(badname)
                }
                else
                {
                    resolve(badname)
                }

            })
        })
    },

    sentOtp:(phone)=>{

        return new Promise((resolve, reject) => {

            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
           

            client.verify.v2.services(process.env.SSID)
                .verifications
                .create({to: `+91${phone}`, channel: 'sms'})
                .then(verification => console.log(verification.status)).then(()=>{

                    resolve({success:true})
                }).catch((err)=>{
                    console.log(err)
                    console.log("OTP ERROR OCCURED")
                    resolve({success:false})
                })

          
        })
    },

    verifyOtp:(phone,otp,id)=>{
       return new Promise((resolve, reject) => {

       
        const client1 = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN); 
        
      
        client1.verify.v2.services(process.env.SSID)
      .verificationChecks
      .create({to: `+91${phone}`, code: otp})
      .then((check)=>{
        if(check.valid)
        {
            User.findByIdAndUpdate(id,{
                $set:{
                    phone:phone
                }
            }).then(()=>{
                resolve({success:true})
            })
        }
        else
        {
          resolve({success:false})
        }
     
      })
        
       })
    },

    updateUsername:(id,uname)=>{
        return new Promise((resolve, reject) => {
            
            User.findByIdAndUpdate(id,{
                $set:{
                    username:uname
                }
            }).then(()=>{
                
                resolve(true)
            })
        })
    },

    updatebio:(bio,id)=>{
        return new Promise((resolve, reject) => {

            User.findByIdAndUpdate(id,{
                $set:{
                    bio:bio
                }
            }).then(()=>{
                resolve({success:true})
            }).catch((err)=>{
                console.log(err)
            })
            
        })
    },

    updateactype:(x,id)=>{
        return new Promise((resolve, reject) => {
            let y = false
            if(x==1)
            {
                y = true
            }

            User.findByIdAndUpdate(id,{
                $set:{
                    private:y
                }
            }).then((response)=>{
                resolve({success:true})
            })
            
            
        })
    },

    follow:(Fid,id)=>{
        return new Promise((resolve, reject) => {
            let x = {}
            let y = {}
            let data
            User.findOne({username:id}).then((data1)=>{
               
                 x = {
                    uid:data1._id,
                    username:data1.username,
                    dp:data1.dp
                     }



                User.find({username:Fid}).then((data2)=>{

                   


                    if(data2.private)
                    {
                        User.findOneAndUpdate({username:Fid},{
                            $addToSet: { requests: x }
                        }).then((data)=>{
                          
                            console.log("done")
                        })
                    }
                    else
                    {
                        User.findOneAndUpdate({username:Fid},{
                            $addToSet: { followers: x }
                        }).then((data)=>{
                            console.log("AGANEY ATHUM AAYI11111111111")
                                console.log(data)
                            y={
                                uid:data._id,
                                username:data.username,
                                dp:data.dp
                            }
                         
                         
                            User.findOneAndUpdate({username:id},{
                                $addToSet: { following: y }
                            }).then(()=>{

                                

                                console.log("000")
                                console.log(data)
                                resolve({success:true,data:y})
                            })
                        })
                    }
                })
            }).then(()=>{
               
               
            }).catch((err)=>{
                console.log(err.message)
                console.log("err occurred")
            })
           
            
        })
    },

    unfollow:(Fid,id)=>{
        return new Promise((resolve, reject) => {

            User.findOneAndUpdate({username:id},{
                $pull: { following: { username: Fid } }
            }).then(()=>{

                User.findOneAndUpdate({username:Fid},{
                    $pull:{
                        followers: { username: id },
                        requests:{username: id}
                    }
                }).then((data)=>{

                    User.findById(data._id).then((data1)=>{
                        console.log(data1)
                        resolve({success:true,data1})
                        console.log("UNFOLLOWED")
                    })
                   

                })
                
            }).then(()=>{

               
            })
            
        })

    },

    getAllPosts:()=>{
        return new Promise((resolve, reject) => {
            
            Post.find({}).then((data)=>{

                console.log(data)
                resolve(data)

            }).catch((err)=>{

                console.log("err occurred")
                console.log(err.message)
            })
        })

    },

    updateDp:(id,img)=>{
        return new Promise((resolve, reject) => {
            
            User.findByIdAndUpdate(id,{
                $set:{
                    dp:img
                }
            }).then(()=>{
                resolve(true)
            })
        })
    },

    uploadPost:(udata,postdata)=>{
        return new Promise((resolve, reject) => {
            
            const post = new Post({
               postType:postdata.type,
               uid:udata._id,
               username:udata.username,
               caption:postdata.caption,
               profilePicture:udata.dp,
               picture:postdata.img,

              });
            
              post.save().then(() => {

                      resolve({success:true})
              

                    

                
              }).catch((err)=>{
                console.log(err.message)
                resolve({success:false})
              })
        }).catch((err)=>{
            console.log(err.message)
        })
    },

    
}