const adminHelper = require('../../helpers/adminHelper/adminHelper')
const User = require('../../models/userSchema')


module.exports = {

    blockUser:async (req,res)=>{

     let data = await adminHelper.blockUser(req.params.id)

     res.json(data)
    },
    deletePost:async(req,res)=>{
        let data = await adminHelper.deletePost(req.params.id)
    }
}