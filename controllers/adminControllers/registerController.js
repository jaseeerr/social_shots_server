const adminHelper = require('../../helpers/adminHelper/adminHelper')
const jwt = require('jsonwebtoken')
module.exports = {


    login:(req,res)=>{

        adminHelper.login(req.body).then((data)=>{

            
            res.json(data)
        })
    }

}