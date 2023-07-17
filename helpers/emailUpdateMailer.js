const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')
module.exports = {


    nodeMailer1:(current,to1)=>{
               
        return new Promise((resolve, reject) => {


            console.log(current,to1)

            function minutesSince(date) {
                // Get the current date and time.
                const now = new Date();
              
                // Calculate the difference between the given date and the current date.
                const difference = now - date;
              
                // Convert the difference to minutes.
                const minutes = difference / 1000 / 60;
              
                // Return the number of minutes.
                return minutes;
              }
    
            const CLIENT_ID = process.env.CLIENT_ID
            const CLIENT_SECRET = process.env.CLIENT_SECRET
            const REDIRECT_URL = process.env.REDIRECT_URL
            const REFRESH_TOKEN = process.env.REFRESH_TOKEN
    
            const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
            oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
    
            async function sendMail()
            {
                
            const data = {email:current,newMail:to1}
            const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3m' });
                const accessToken = await oAuth2Client.getAccessToken()
    
                const transport = nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        type: 'OAuth2',
                        user:process.env.NODEMAILER_USER,
                        clientId:CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken:REFRESH_TOKEN,
                        accessToken:accessToken
    
                    }
                })
    
                const mailOptions = {
                    from: process.env.NODEMAILER_USER,
                    to: to1,
                    subject: 'SocialShots verifications',
                    text: `Click on this like to update your email provided in SocialShots ${process.env.BASE_URL}verifyemail/${token}. \n do not click on this link if you didn't request to update the mail.`
                  };
    
                  const result = await transport.sendMail(mailOptions)
                 
                 return result
                  
    
            }
    
            
    
            User.findOne({email:current}).then((response)=>{
    
                if(response)
                {
                     
                      const min = minutesSince(response.lastverified)
    console.log(min)
                      if(min>=1)
                      {
                       
    
                           User.findByIdAndUpdate(response._id,{
                            $set:{
                                lastverified:Date.now()
                            }
                        }).then(()=>{
    
                            sendMail().then(()=>{
    
                                console.log("mail send")
                                resolve({success:true})
                             
    
                            }).catch((err)=>{
                                console.log(err)
                                console.log(err.message)
                            })
    
                        })
                      }
                      else
    
                      {
                        console.log("sPAM BLOCKEd")
                      }
                }
            }).catch((err)=>{
                console.log(err)
            })
            
            
        })

      


        
      

    }
}