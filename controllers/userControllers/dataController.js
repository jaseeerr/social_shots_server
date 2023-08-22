const userHelper = require("../../helpers/userHelper/userHelper");
const jwt = require("jsonwebtoken");

module.exports = {
  getUserdata: (req, res) => {
    userHelper.getUserdata(req.params.id).then((data1) => {
      let data = {
        data1,
        own: false,
      };

      if (req.user.username == data1.username) {
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
  getStories:async (req, res) => {

    let data = await userHelper.getStories(req.user)
    res.json(data)
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

  newUsers: (req, res) => {
    userHelper.newUser(req.user.username).then((data) => {
      res.json(data);
    });
  },

  getChatList: async (req, res) => {
    let data = await userHelper.getChatList(req.user._id);

    res.json(data);
  },

  getChat: async (req, res) => {
    let data = await userHelper.getChat(req.params.id, req.user._id);

    res.json(data);
  },
  notifyCount: async (req, res) => {
    let data = await userHelper.notifyCount(req.user._id);

    res.json(data);
  },
  messageCount: async (req, res) => {
    let data = await userHelper.messageCount(req.user._id);

    res.json(data);
  },
  getNotification: async (req, res) => {
    let data = await userHelper.getNotification(req.user._id);
    console.log(data);
    res.json(data);
  },
};
