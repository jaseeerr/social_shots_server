const userHelper = require("../../helpers/userHelper/userHelper");
const Message = require('../../models/messageSchema')
const User = require("../../models/userSchema");



module.exports = {
  uploadPost: (req, res) => {
    userHelper.uploadPost(req.user, req.body).then((data) => {
      res.json(data);
    });
  },

  reportPost: (req, res) => {
    userHelper.reportPost(req.params.id, req.user._id).then((response) => {
      res.json(response);
    });
  },

  deletePost: (req, res) => {
    userHelper.deletePost(req.params.id,req.user._id).then((response) => {
      res.json(response);
    });
  },

  follow: (req, res) => {
    userHelper.follow(req.params.id, req.user.username).then((response) => {
      res.json(response);
    });
  },

  unfollow: (req, res) => {
    userHelper.unfollow(req.params.id, req.user.username).then((response) => {
      res.json(response);
    });
  },

  cancelRequest: (req, res) => {
    userHelper.cancelRequest(req.params.id, req.user._id).then((response) => {
      res.json(response);
    });
  },
  search: async (req, res) => {
    const { query } = req.query;
    try {
      // Perform search using Mongoose query
      const searchResults = await User.find({
        username: { $regex: query, $options: "i" },
      });

      res.json(searchResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  likePost: (req, res) => {
    userHelper.likePost(req.params.id, req.user._id).then((response) => {
      res.json(response);
    });
  },

  unlikePost: (req, res) => {
    userHelper.unlikePost(req.params.id, req.user._id).then((response) => {
      res.json(response);
    });
  },

  comment: (req, res) => {
    
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const data = {
      uid: req.user._id,
      pid: req.body.id,
      comment: req.body.newComment,
      date: `${currentDay} ${month[currentMonth]} ${currentYear}`,
    };

  

    userHelper.comment(data).then((response) => {
      res.json(response);
    });
  },

  deletecomment: (req, res) => {
    userHelper.deletecomment(req.body).then((response) => {
      res.json(response);
    });
  },

  markSeen:async (req, res) => {
    console.log(req.body)
    const { receiver1, sender1 } = req.body;

    try {
      const t = await   Message.find(
        {
           
             sender: sender1,
              receiver: receiver1 
               
            
        }
       
    )
      
    if(sender1)
    {
     
 



      await Message.updateMany(
        {
            $and: [
                { sender: sender1 },
                { receiver: receiver1 },
               
            ]
        },
        { $set: { seenByReceiver: true } }
    )
   
    console.log(t)
      console.log("Done")

      res.status(200).json({ success: true });


    }

    
       
    } catch (error) {
         res.status(500).json({ error: 'Failed to mark messages as seen.' });
    }
},




};
