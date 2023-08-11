const { resolveContent } = require('nodemailer/lib/shared')
const Admin = require('../../models/adminSchema')
const User = require("../../models/userSchema")
const Post = require('../../models/postSchema')
const jwt = require('jsonwebtoken')


module.exports = {



    login:(data)=>{

      return new Promise((resolve, reject) => {
        
        Admin.findOne({username:data.email}).then((res)=>{

            console.log(data);
            console.log(res)
            if(res)
            {
                if(res.password==data.password)
                {
                    const data = JSON.parse(JSON.stringify(res))
                    const token = jwt.sign(data,process.env.ADMIN_ACCESS_TOKEN_SECRET)     
                    resolve({success:true,token})
                }
                else
                {
                    resolve({badpass:true})
                }

            }
            else
            {
                resolve({baduser:true})
            }
            
        }).catch((err)=>{
            console.log(err.message)
            resolve({err:true})
        })

      })
    },

    dashboardData: ()=>{

       try {
        

        return new Promise( async (resolve, reject) => {
            
            let data1 = await User.find({})
            const dates = data1.map((x)=>x.createdOn.getMonth())
            const userChart = [0,0,0,0,0,0,0,0,0,0,0,0]
          
            dates.forEach(element => {
                userChart[element]++
            });

            let data2 = await Post.find({})
            let photoCount = 0
            let videoCount = 0
            data2.forEach(element => {
                
                if(element.postType=="img")
                {
                    photoCount++
                }
                else
                {
                    videoCount++
                }
            });

            let temp = data2.filter((x)=>x.postType=="img")
           let dates1 = temp.map((x)=>{
          
                let y = new Date(x.date)
                return y.getMonth()
          
            
           })
        
           const imageChart = [0,0,0,0,0,0,0,0,0,0,0,0]
           dates1.forEach(element => {
            imageChart[element]++
        });

           let temp1 = data2.filter((x)=>x.postType=="video")
           let dates2 = temp1.map((x)=>{
            if(x.postType=="video")
            {
                let y = new Date(x.date)
                return y.getMonth()
            }
            
           })
           const videoChart = [0,0,0,0,0,0,0,0,0,0,0,0]
           dates2.forEach(element => {
            videoChart[element]++
        });
           

            const data = {
                userChart,
                imageChart,
                videoChart,
                userCount:data1.length,
                photoCount,
                videoCount
            }

          
            resolve(data)
               
        })


       } catch (error) {

        console.log(err.message)
        
       }
    },

    allusers:()=>{

        try {


            return new Promise(async(resolve, reject) => {

                let users = await User.find({});
    
                const posts = await Post.find({});
                const uid = posts.map((x)=>x.uid)
                
                let temp = []
                users.forEach(element => {
                    let data = {
                        id:element._id,
                        username: element.username,
                        dp:element.dp,
                        following : element.following.length,
                        followers: element.followers.length,
                        postCount: 0,
                        accountStatus: element.block,
                        reports: element.reports.length,
                        accountType:element.private
                    }
                    temp.push(data)
                })

            

                temp.forEach(x => {

                    uid.forEach(y => {
                        
                        if(x.id==y)
                        {
                            x.postCount++
                        }
                    });
                    
                });
                
              
                
                resolve(temp);



                
            })


        } catch (error) {


            console.log(error.message);
            resolve({err:true})
            
        }
    },

    allposts:()=>{

        try {
            
            return new Promise( async(resolve, reject) => {
                
                let posts = await Post.find({})
                let uid = posts.map((x)=>x.uid)
                let users = await User.find({})
                posts.forEach(x => {
                    
                    users.forEach(y=>{

                        if(x.uid==y._id)
                        {
                            x.username = y.username
                            
                        }
                    })
                });

                resolve(posts)
                
            })


        } catch (error) {
            
            console.log(error.message)

        }

    },

    blockUser:(id)=>{

        try {
            
            return new Promise( async(resolve, reject) => {
             let temp = await User.findById(id)
             let temp1 = await User.findByIdAndUpdate(id,{
                $set:{
                    block:!temp.block
                }
             })

             resolve({success:true})
            })
 
           

        } catch (error) {
            console.log(error.message)
            resolve({err:true})
        }
    },

    deletePost:(id)=>{
        try {
            
            return new Promise(async(resolve, reject) => {
                
                let res = await Post.findByIdAndDelete(id)
                resolve({success})
            })


        } catch (error) {
            console.log(error.message)
            
        }
    }


}