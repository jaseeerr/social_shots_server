const adminHelper = require('../../helpers/adminHelper/adminHelper')

module.exports = {


    dashboardData:async(req,res)=>{

        let data = await adminHelper.dashboardData()
        res.json(data)
    },

    allusers: async(req,res)=>{
        let data = await adminHelper.allusers()
       
        res.json(data)
    },

    allposts: async(req,res)=>{

        let data = await adminHelper.allposts()

        res.json(data)
    },
    visitors:async(req,res)=>{
        let data = await adminHelper.visitor()
        res.json(data)
    }
}