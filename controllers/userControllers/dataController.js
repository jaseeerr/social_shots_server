const userHelper = require("../../helpers/userHelper");
const jwt = require("jsonwebtoken");


module.exports = {

    getUserdata: (req, res) => {
        userHelper.getUserdata(req.params.id).then((data1) => {
          const token = jwt.sign(
            JSON.parse(JSON.stringify(data1)),
            process.env.ACCESS_TOKEN_SECRET
          );
          let data = {
            data1,
            own: req.user._id == data1._id ? true : false,
            token: token,
          };
    
          let x = req.user._id;
          x = toString(x);
          let y = data1._id;
          y = toString(y);
    
          if (x == y) {
            data.own = true;
          }
    
          res.json(data);
        });
      },
      myData: (req, res) => {
        userHelper.myData(req.user._id).then((data) => {
          res.json(data);
        });
      },
    
      getMyPosts: (req, res) => {
        userHelper.getMyPosts(req.params.id).then((data) => {
          res.json(data);
        });
      },
    
      getOnePost: (req, res) => {
        userHelper.getOnePost(req.params.id).then((data) => {
          let own = false;
          if (data.uid == req.user._id) {
            own = true;
          }
          res.json({ data, own });
        });
      },
      getAllPosts: (req, res) => {
        userHelper.getAllPosts().then((data) => {
          data = data.reverse();
          res.json(data);
        });
      },

      myFeed: (req, res) => {
        userHelper.myFeed(req.user._id).then((response) => {
          res.json(response);
        });
      },

      
  shortList: (req, res) => {
    userHelper.shortList(req.body).then((data) => {
      res.json(data);
    });
  },

  shortList1: (req, res) => {
    userHelper.shortList1(req.body).then((data) => {
      res.json(data);
    });
  },

}