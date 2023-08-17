const userHelper = require("../../helpers/userHelper/userHelper");
const jwt = require("jsonwebtoken");
const { nodeMailer } = require("../../helpers/nodemailer/nodemailerHelper");


module.exports = {
  test: async (req, res) => {},

  home: (req, res) => {
    res.send("HEY HOME REACHED");
  },
  signup: (req, res) => {
    userHelper.singup(req.body).then((response) => {
      res.json(response);
    });
  },

  login: (req, res) => {
    try {
      userHelper.login(req.body).then((response) => {
        let data;
        if (response.success) {
          let name = response.data.username;
          response.data.password = "";
          const data1 = JSON.parse(JSON.stringify(response.data));
          const token = jwt.sign(data1, process.env.ACCESS_TOKEN_SECRET);
          if (response.data.verified) {
            data = {
              name: name,
              success: true,
              token: token,
              data:response.data
            };
          } else {
            nodeMailer(response.data.email);
            data = {
              notVerified: true,
            };
          }
        } else if (response.baduser) {
          data = {
            baduser: true,
          };
        } else if (response.badpass) {
          data = {
            badpass: true,
          };
        } else if (response.blocked) {
          data = {
            blocked: true,
          };
        } else if (response.gerr) {
          data = {
            gerr: true,
          };
        }
        res.json(data);
      });
    } catch (error) {
      res.json({ error: true });
    }
  },
  glogin: (req, res) => {
    userHelper.glogin(req.body).then((response) => {
      let data;
      if (response.success) {
        let name = response.data.username;
        response.data.password = "";
        const data1 = JSON.parse(JSON.stringify(response.data));
        const token = jwt.sign(data1, process.env.ACCESS_TOKEN_SECRET);
        if (response.data.verified) {
          data = {
            name: name,
            success: true,
            token: token,
          };
        } else {
          nodeMailer(response.data.email);
          data = {
            notVerified: true,
          };
        }
      } else if (response.baduser) {
        data = {
          baduser: true,
        };
      } else if (response.badpass) {
        data = {
          badpass: true,
        };
      } else if (response.blocked) {
        data = {
          blocked: true,
        };
      }

      res.json(data);
    });
  },

 

 

 





 
};
