const userHelper = require("../../helpers/userHelper");
const jwt = require("jsonwebtoken");

const User = require("../../models/userSchema");

module.exports = {


    sentOtp: (req, res) => {
        userHelper.sentOtp(req.params.id).then((response) => {
          res.json(response);
        });
      },
    
      verifyOtp: (req, res) => {
        const { phone, otp } = req.query;
        userHelper.verifyOtp(phone, otp, req.user._id).then((response) => {
          res.json(response);
        });
      },

      verifyuser: (req, res) => {
        jwt.verify(req.params.id, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          if (err) return res.render("notVerified");
    
          User.findOneAndUpdate(
            { email: user.email },
            {
              $set: {
                verified: true,
              },
            }
          ).then(() => {
            res.render("verified1");
          });
        });
      },
    
      verifyemail: (req, res) => {
        jwt.verify(req.params.id, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          if (err) {
            return res.render("notVerified");
          } else {
            User.findOneAndUpdate(
              { email: user.email },
              {
                $set: {
                  email: user.newMail,
                },
              }
            ).then(() => {
              res.render("updatedEmail");
            }).catch((err)=>{
                console.log("err")
                console.log(err.message)
                res.render("notVerified");
            })
          }
        });
      },

}