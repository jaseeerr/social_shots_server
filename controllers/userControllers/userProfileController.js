const userHelper = require("../../helpers/userHelper");
const { nodeMailer1 } = require("../../helpers/emailUpdateMailer");

module.exports = {
  updateUsername: (req, res) => {
    try {
      userHelper
        .updateUsername(req.user._id, req.params.id)
        .then((response) => {
          res.json({ success: response });
        });
    } catch (error) {
      res.json({ error: true });
    }
  },

  updateEmail: async (req, res) => {
    nodeMailer1(req.user.email, req.params.id)
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        console.log("err");
      });
  },

  updatebio: (req, res) => {
    userHelper.updatebio(req.params.id, req.user._id).then((response) => {
      res.json(response);
    });
  },

  updateactype: (req, res) => {
    userHelper.updateactype(req.params.id, req.user._id).then((response) => {
      res.json(response);
    });
  },
  checkUsername: (req, res) => {
    const uname = req.params.id;
    if (uname.length < 4) {
      res.json({ badname: true });
    } else {
      userHelper.checkUsername(uname).then((badname) => {
        res.json({ badname: badname });
      });
    }
  },

  updateDp: (req, res) => {
    userHelper.updateDp(req.user._id, req.params.id).then((response) => {
      res.json({ success: response });
    });
  },
};
