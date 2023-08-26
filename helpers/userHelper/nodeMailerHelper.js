const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const jwt = require('jsonwebtoken')
const User = require('../../models/userSchema')
module.exports = {


    nodeMailer:(id)=>{

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
            
        const data = {email:id}
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
                to: id,
                subject: 'SocialShots verifications',
                
                html: '<body style="background-color: #121212; color: #fff; font-family: Arial, sans-serif; margin: 0; padding: 0;">' +
                '<header style="background-color: #333; padding: 20px; text-align: center;">' +
                '<h1 style="font-size: 36px;">SocialShots</h1>' +
                '</header>' +
                '<main style="padding: 20px; text-align: center;">' +
               
                '<p style="font-size: 18px; line-height: 1.6;text-align: center;">Thank you for joining Social Shots! We\'re thrilled to have you as part of our community. To ensure the security of your account and access all the features, please click on the "Verify Account" button below to complete your registration.</p>' +
                '<p style="font-size: 18px;text-align: center; line-height: 1.6;">If you did not sign up for an account on Social Shots, please ignore this email.</p>' +
                `<a href="${process.env.BASE_URL}verifyuser/${token}" style="display: block; margin-top: 20px; background-color: #007bff; color: #fff; padding: 10px; text-align: center; text-decoration: none;">Verify Account</a>` +
                '</main>' +
                '</body>'

              };

              const result = await transport.sendMail(mailOptions)

              return result

        }

        User.findOne({email:id}).then((response)=>{

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
        })
        



    }
}