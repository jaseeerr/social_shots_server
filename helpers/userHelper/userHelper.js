const User = require("../../models/userSchema");
const argon = require("argon2");
const Post = require("../../models/postSchema");
const Visitor = require("../../models/visitorSchema");
const Story = require('../../models/storySchema')
const Mailer = require("./nodeMailerHelper");
const twilio = require("twilio");
const Messages = require("../../models/messageSchema");
const Notification = require("../../models/notificationSchema");

module.exports = {
  singup: (userdata) => {
    return new Promise((resolve, reject) => {
      if (!userdata.password) {
        resolve({ err: true });
      }

      argon.hash(userdata.password).then((pass) => {
        const user = new User({
          username: userdata.name.toLowerCase(),
          email: userdata.email,
          createdOn: Date.now(),
          password: pass,
        });

        user
          .save()
          .then(() => {
            Mailer.nodeMailer(userdata.email);
            resolve({ success: true });
          })
          .catch((error) => {
            if (error.name === "MongoServerError" && error.code === 11000) {
              // Duplicate key error
              resolve({ exuser: true });
              // throw new Error('Email already exists.');
            } else {
              resolve({ success: false });
            }
          });
      });
    });
  },

  login: (udata) => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: udata.email }).then((data) => {
        if (data) {
          if (data.password == null) {
            resolve({ gerr: true });
          } else if (data.block) {
            resolve({ blocked: true });
          } else {
            argon.verify(data.password, udata.password).then((pass) => {
              if (pass) {
                resolve({ success: true, data });
              } else {
                resolve({ badpass: true });
              }
            });
          }
        } else {
          User.findOne({ username: udata.email }).then((data1) => {
            if (data1) {
              if (data1.block) {
                resolve({ blocked: true });
              } else {
                argon.verify(data1.password, udata.password).then((pass) => {
                  if (pass) {
                    const data = data1;
                    resolve({ success: true, data });
                  } else {
                    resolve({ badpass: true });
                  }
                });
              }
            } else {
              resolve({ baduser: true });
            }
          });
        }
      });
    });
  },

  glogin: (info) => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: info.email }).then((data) => {
        if (data && !data.block) {
          if (data.block) {
            resolve({ blocked: true });
          } else {
            resolve({ success: true, data });
          }
        } else {
          const num = Math.floor(Math.random() * 900) + 100;
          const temp = info.email.split("@");
          const name = `${temp[0]}${num}`;

          const user = new User({
            username: name.toLowerCase(),
            email: info.email,
            createdOn: Date.now(),
            password: null,
            verified: true,
            gAccount: true,
          });

          user.save().then(() => {
            User.findOne({ email: info.email }).then((data) => {
              resolve({ success: true, data });
            });
            //   nodeMailer(userdata.email)
          });
        }
      });
    });
  },

  getUserdata: (id) => {
    return new Promise((resolve, reject) => {
      User.findOne({ username: id }).then((data) => {
        if (data == null) {
          data = {};
        }
        resolve(data);
      });
    });
  },

  myData: (id) => {
    return new Promise((resolve, reject) => {
      User.findById(id).then((data) => {
        resolve(data);
      });
    });
  },

  getMyPosts: (id) => {
    return new Promise((resolve, reject) => {
      User.findOne({ username: id }).then((data1) => {
        Post.find({ uid: data1._id }).then((data) => {
          data = data.reverse();
          resolve(data);
        });
      });
    });
  },

  getOnePost: (id, ownId) => {
    return new Promise((resolve, reject) => {
      Post.findById(id).then((data) => {
        User.findById(data.uid)
          .then((data1) => {
            data.username = data1.username;
            data.profilePicture = data1.dp;
            if (data.uid == ownId) {
              data.own = true;
            }
          })
          .then(() => {
            resolve(data);
          });
      });
    });
  },

  checkUsername: (uname) => {
    return new Promise((resolve, reject) => {
      let badname = false;
      uname = uname.toLowerCase();
      User.find({ username: uname }).then((response) => {
        if (response.length != 0) {
          badname = true;
          resolve(badname);
        } else {
          resolve(badname);
        }
      });
    });
  },

  sentOtp: (phone) => {
    return new Promise((resolve, reject) => {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      client.verify.v2
        .services(process.env.SSID)
        .verifications.create({ to: `+91${phone}`, channel: "sms" })
        .then((verification) => console.log(verification.status))
        .then(() => {
          resolve({ success: true });
        })
        .catch((err) => {
          console.log(err);

          resolve({ success: false });
        });
    });
  },

  verifyOtp: (phone, otp, id) => {
    return new Promise((resolve, reject) => {
      const client1 = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      client1.verify.v2
        .services(process.env.SSID)
        .verificationChecks.create({ to: `+91${phone}`, code: otp })
        .then((check) => {
          if (check.valid) {
            User.findByIdAndUpdate(id, {
              $set: {
                phone: phone,
              },
            }).then(() => {
              resolve({ success: true });
            });
          } else {
            resolve({ success: false });
          }
        });
    });
  },

  updateUsername: (id, uname) => {
    console.log(id)
    console.log(uname)
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(id, {
        $set: {
          username: uname,
        },
      }).then(() => {
        resolve(true);
      });
    });
  },

  updatebio: (bio, id) => {
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(id, {
        $set: {
          bio: bio,
        },
      })
        .then(() => {
          resolve({ success: true });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },

  updateactype: (x, id) => {
    return new Promise((resolve, reject) => {
      let y = false;
      if (x == 1) {
        y = true;
      }

      User.findByIdAndUpdate(id, {
        $set: {
          private: y,
        },
      }).then((response) => {
        Post.updateMany(
          { uid: id },
          {
            $set: {
              private: y,
            },
          }
        ).then(() => {
          resolve({ success: true });
        });
      });
    });
  },
  expiredstories:(data)=>{

    return new Promise(async(resolve, reject) => {

    
      try {
        await Story.deleteMany({ _id: { $in: data } })
        resolve({success:true})
      } catch (error) {
        console.log(error)
      }
    })
  },

  storyview:(id,uid)=>{

    return new Promise(async(resolve,reject)=>{

      try {
        await Story.findByIdAndUpdate(id,{
          $addToSet:{views:uid}
        })
        resolve({success:true})
      } catch (error) {
        console.log(error)
        resolve({success:false})
      }
   

    })
  },
  follow: (Fid, id) => {
    return new Promise((resolve, reject) => {
      let x = {};
      let y = {};
      let data;
      User.findOne({ username: id })
        .then((data1) => {
          x = {
            uid: data1._id,
            username: data1.username,
            dp: data1.dp,
          };

          User.findOne({ username: Fid }).then((data2) => {
            if (data2.private) {
              User.findOneAndUpdate(
                { username: Fid },
                {
                  $addToSet: { requests: x },
                }
              ).then((data) => {
                resolve({ requested: true });
              });
            } else {
              User.findOneAndUpdate(
                { username: Fid },
                {
                  $addToSet: { followers: x },
                }
              ).then((data) => {
                y = {
                  uid: data._id,
                  username: data.username,
                  dp: data.dp,
                };

                User.findOneAndUpdate(
                  { username: id },
                  {
                    $addToSet: { following: y },
                  }
                ).then(() => {
                  resolve({ success: true, data: x });
                });
              });
            }
          });
        })
        .then(() => {})
        .catch((err) => {
          console.log(err.message);
        });
    });
  },

  accept:(Fid, id)=>{

    return new Promise((resolve, reject) => {
        let otherId
        let myId
        let req
        let x = {};
        let y = {};
        let data;
        User.findOne({ username: id })
          .then((data1) => {
            myId = data1._id
            req = data1.requests
            x = {
              uid: data1._id,
              username: data1.username,
              dp: data1.dp,
            };
  
        
            User.findOne({ username: Fid }).then((data2) => {
                otherId = data2._id
                console.log(Fid)
                console.log(x)
                console.log(data2)
                User.findOneAndUpdate(
                  { username: Fid },
                  {
                    $addToSet: { following: x },
                  }
                ).then((data) => {
                 
                  y = {
                    uid: data._id,
                    username: data.username,
                    dp: data.dp,
                  };
            
  
                  User.findOneAndUpdate(
                    { username: id },
                    {
                      $addToSet: { followers: y },
                    }
                  ).then(() => {

               
                  const filteredArray = req.filter((obj) => !obj.uid.equals(otherId));
                  console.log(filteredArray)
                    User.findByIdAndUpdate(myId,{
                        $set:{
                            requests:filteredArray
                        }
                    }).then(()=>{
                        resolve({ success: true, data: x });
                    })
                  
                  });
                });
              
            });
          })
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
      });
  },

  declineRequest:(id,fid)=>{

    return new Promise(async(resolve, reject) => {
      
      try {
        
              let info = await User.findById(id)
              let req = info.requests
              const newReq = req.filter((x)=>x.uid!=fid)
            await  User.findByIdAndUpdate(id,{
                $set:{
                  requests:newReq
                }
              })
             
              resolve({success:true})
      } catch (error) {
        console.log(error)
      }
    })
  },

  unfollow: (Fid, id) => {
    return new Promise((resolve, reject) => {
        let myId
        let otherId

      User.findOneAndUpdate(
        { username: id },
        {
          $pull: { following: { username: Fid } },
        }
      )
        .then((data3) => {
                myId = data3._id
          User.findOneAndUpdate(
            { username: Fid },
            {
              $pull: {
                followers: { username: id },
                requests: { username: id },
              },
            }
          )
            .then((data) => {
                otherId = data._id
              User.findById(data._id).then((data1) => {


                Notification.deleteOne({from:myId,to:otherId,type:"follow"}).then(()=>{
                    resolve({ success: true, data1 })
                })
                
              })
            })
            .catch((err) => {
              console.log(err.message)
            })
        })
        .then(() => {})
        .catch((err) => {
          console.log(err.message)
        });
    });
  },

  getAllPosts: () => {
    return new Promise((resolve, reject) => {
      Post.find({ private: false })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  },

  getStories:(udata)=>{
      return new Promise(async(resolve, reject) => {
   
       try {
        
        let uids = udata.following.map((x)=>x.uid)
        uids.push(udata._id)
        const list = await Story.find({ uid: { $in: uids } })
        const uinfo = await User.find({ _id: { $in: uids } })
        console.log(list)
        console.log(uinfo)
        list.forEach(x => {

         uinfo.forEach(y => {

           if(x.uid==y._id)
           {
             x.dp = y.dp
             x.username = y.username
           }
           
         })
         
        })

        resolve(list)

       } catch (error) {
        
        console.log(error)
        resolve({err:true})
       }
      })
  },

  updateDp: (id, img) => {
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(id, {
        $set: {
          dp: img,
        },
      }).then(() => {
        resolve(true);
      });
    });
  },

  reportAccount: (id, uid) => {
    return new Promise(async (resolve, reject) => {
      try {
        await User.findByIdAndUpdate(id, {
          $addToSet: {
            reports: uid,
          },
        });

        resolve({ success: true });
      } catch (error) {
        console.log(error.message);
        resolve({
          err: true,
          message: "Error on report account function userhelper",
        });
      }
    });
  },

  uploadPost: (udata, postdata) => {
    return new Promise((resolve, reject) => {
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

      User.findById(udata._id).then((data) => {
        const post = new Post({
          postType: postdata.type,
          uid: udata._id,
          username: udata.username,
          caption: postdata.caption,
          profilePicture: udata.dp,
          picture: postdata.img,
          private: data.private,
          date: `${currentDay} ${month[currentMonth]} ${currentYear}`,
        });

        post
          .save()
          .then(() => {
            resolve({ success: true });
          })
          .catch((err) => {
            console.log(err.message);
            resolve({ success: false });
          });
      });
    }).catch((err) => {
      console.log(err.message);
    });
  },

  uploadStory:(userdata,pdata)=>{

    return new Promise(async(resolve, reject) => {
           try {
            const story = new Story({
        
              uid: userdata._id,
              username: userdata.username,
              dp: userdata.dp,
              picture: pdata.img,
              private: userdata.private,
            });
      
            story
              .save()
              .then(() => {
                resolve({ success: true });
              })

           } catch (error) {
            console.log(error)
           }

    })
  },
  reportPost: (id, uid) => {
    return new Promise((resolve, reject) => {
      Post.findByIdAndUpdate(id, {
        $addToSet: {
          reported: uid,
        },
      })
        .then(() => {
          resolve({ success: true });
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  },

  deletePost: (id, uid) => {
    return new Promise((resolve, reject) => {
      Post.findById(id).then((res) => {
        if (res.uid == uid) {
          Post.findByIdAndDelete(id).then(() => {
            resolve({ success: true });
          });
        } else {
          resolve({ success: false });
        }
      });
    });
  },

  myFeed: (id) => {
    return new Promise((resolve, reject) => {
      let arr;
      User.findById(id).then((data1) => {
        arr = data1.following.map((x) => {
          return x.uid;
        });

        arr.push(id);

        Post.find({ uid: { $in: arr } }).then((data) => {
          data = data.reverse();
          resolve(data);
        });
      });
    });
  },

  likePost: (pid, uid) => {
    return new Promise((resolve, reject) => {
      Post.findByIdAndUpdate(pid, {
        $addToSet: {
          likes: uid,
        },
      })
        .then(() => {
          resolve({ success: true });
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  },

  unlikePost: (pid, uid) => {
    return new Promise((resolve, reject) => {
      Post.findByIdAndUpdate(pid, {
        $pull: {
          likes: uid,
        },
      })
        .then(() => {
          resolve({ success: true });
        })
        .catch((err) => {
          // console.log(err.message)
          console.log("BLEH eERRr");
        });
    });
  },

  shortList: (data) => {
    return new Promise((resolve, reject) => {
      User.find({ _id: { $in: data } })
        .then((data1) => {
          const data2 = data1.map((x) => {
            return { uid: x._id, username: x.username, dp: x.dp };
          });

          resolve(data2);
        })
        .catch((err) => {
          console.log("ERR ");
        });
    });
  },
  shortList1: (data) => {
    return new Promise((resolve, reject) => {
      User.find({ _id: { $in: data } })
        .then((data1) => {
          const data2 = data1.map((x) => {
            return { uid: x._id, username: x.username, dp: x.dp };
          });

          resolve(data2);
        })
        .catch((err) => {});
    });
  },

  newUser: (id) => {
    return new Promise((resolve, reject) => {
      User.find({verified:true})
        .then((res1) => {
          let res = res1.filter((x) => {
            let id1 = x.username;

            return id1 != id;
          });

          let data = res.reverse();
          if (res.length > 3) {
            data = res.slice(0, 3);
          }

          resolve(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  },

  comment: (pdata) => {
    return new Promise((resolve, reject) => {
      Post.findById(pdata.pid).then((res1) => {
        let index = res1.comments.length;
        pdata.index = index;

        Post.findByIdAndUpdate(pdata.pid, {
          $push: {
            comments: pdata,
          },
        })
          .then(() => {
            Post.findById(pdata.pid).then((data) => {
              resolve({ success: true, data });
            });
          })
          .catch((err) => {
            console.log(err.message);
            resolve({ err: true });
          });
      });
    });
  },

  deletecomment: (pdata) => {
    return new Promise((resolve, reject) => {
      Post.findById(pdata.pid).then((data) => {
        const data1 = data.comments.filter((x) => {
          return x.index != pdata.cid;
        });

        Post.findByIdAndUpdate(data._id, {
          $set: {
            comments: data1,
          },
        })
          .then(() => {
            Post.findById(data._id).then((data2) => {
              const data3 = data2.comments;

              resolve({ data3, success: true });
            });
          })
          .catch((err) => {
            console.log(err.message);
            resolve({ success: false });
          });
      });
    });
  },

  getChatList: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        let data1 = await Messages.find({
          $or: [{ sender: id }, { receiver: id }],
        });
        let senders = data1.map((message) => message.sender);
        let receivers = data1.map((message) => message.receiver);
        senders = senders.filter((x) => x != id);
        receivers = receivers.filter((x) => x != id);
        let uids = [...new Set([...senders, ...receivers])];
        let uinfo = await User.find({ _id: { $in: uids } });
        let list = uinfo.map((x) => {
          return {
            id: x._id,
            username: x.username,
            dp: x.dp,
            newMessage: false,
          };
        });
        const x = await Messages.distinct("sender", {
          receiver: id,
          seenByReceiver: false,
        });

        x.forEach((element) => {
          list.forEach((element1) => {
            if (element == element1.id) {
              element1.newMessage = true;
            }
          });
        });

        console.log(list);
        let data = {
          list: list,
          myId: id,
        };
        resolve(data);
      } catch (error) {
        console.log(error.message);
        resolve({ err: true, message: "error on getchatlist function" });
      }
    });
  },

  getChat: (fid, id) => {
    return new Promise(async (resolve, reject) => {
      try {
        let content = await Messages.find({
          $or: [
            { $and: [{ sender: id }, { receiver: fid }] },
            { $and: [{ sender: fid }, { receiver: id }] },
          ],
        }).sort({ date: 1 });
        // content = content.reverse()
        let senderInfo = await User.findById(id);
        let receiverInfo = await User.findById(fid);

        let data = {
          content: content,
          // senderName:senderInfo.username,
          // senderDp:senderInfo.dp,
          senderId: id,
          receiverId: fid,
          receiverName: receiverInfo.username,
          receiverDp: receiverInfo.dp,
        };

        resolve(data);
      } catch (error) {
        console.log(error.message);
        resolve({ err: true, message: "error on getchat function" });
      }
    });
  },

  notifyCount: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Notification.find({ to: id, seen: false });
        const data1 = await User.findById(id)
        const x = data1.requests.length + data.length
        resolve(x);
      } catch (error) {
        console.log(error.message);
      }
    });
  },

  messageCount: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const x = await Messages.distinct("sender", {
          receiver: id,
          seenByReceiver: false,
        });

        resolve(x.length);
      } catch (error) {
        console.log(error.messages);
      }
    });
  },

  getNotification: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const temp = await Notification.find({ to: id }).sort({ date: -1 });
        const uids = temp.map((x) => x.from);
        const uniqueUids = [...new Set(uids)];
        const uinfo = await User.find({ _id: { $in: uniqueUids } });

        const notification = temp.map((x) => {
          const y = {
            id: x._id,
            from: x.from,
            to: x.to,
            pid: x.pid,
            type: x.type,
            date: x.date,
            seem: x.seen,
            fromUsername: "",
            fromDp: "",
          };
          return y;
        });

        uinfo.forEach((x) => {
          notification.forEach((y) => {
            if (x._id == y.from) {
              y.fromUsername = x.username;
              y.fromDp = x.dp;
            }
          });
        });

        let req = await User.findById(id);
        const req1 = req.requests;
        const uids1 = req.requests.map((x) => x.uid);
        const uinfo1 = await User.find({ _id: { $in: uids1 } });

        req1.forEach((x) => {
          uinfo1.forEach((y) => {
            if (x.uid == y._id) {
              x.username = y.username;
              x.dp = y.dp;
            }
          });
        });

      await Notification.updateMany({to:id},{$set:{seen:true}})

        resolve({ notification, request: req1 });
      } catch (error) {
        console.log(error.message);
      }
    });
  },
  visitors:(data)=>{

    return new Promise(async(resolve, reject) => {
      
      try {

        const newVisitor = new Visitor(data)

        // Save the newVisitor instance to the database
        newVisitor.save()
          .then(savedVisitor => {
            console.log('Visitor data saved:', savedVisitor);
            resolve({success:true})
          })
          .catch(error => {
            console.error('Error saving visitor data:', error);
            resolve({success:false})
          })
        
      } catch (error) {
        console.log("Visitor ERR")
        console.log(error)
        resolve({success:false})
        
      }
    })
  }
};
