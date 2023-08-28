const { Server } = require("socket.io");
const cors = require("cors");
const Message = require("../models/messageSchema");
const Notification = require('../models/notificationSchema')

// Export a function to create and configure the Socket.io server
module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  const emailToSocketIdMap = new Map();
  const socketidToEmailMap = new Map();

  io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`);

    // Join Chat
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(data,"joined")
   
    });
    //  Disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

     //  Message Seen
     socket.on("message_seen", (data) => {
     console.log(data)
     console.log("MESSAGE SEEEN")
     socket.to(data.receiver).emit("message_seen",data)


    });

    //typing
    socket.on("typing", (data) => {
      console.log(data)
      console.log("typing")
      socket.to(data.room).emit("typing",data)
 
     });

      //Notification
    socket.on("notification", async(data) => {
      
      

     if(data.to!=data.from)
     {
      const newNotification = new Notification({
        to: data.to,
        from: data.from,
        type: data.type,
        img: data.img,
        pid:data.pid
      })

      // Save the new message to the database
      newNotification
        .save()
        .then((savedMessage) => {
          socket.to(data.receiver).emit("receive_message", savedMessage);
          console.log("Message saved:", savedMessage);
          // Close the database connection after saving
        })
        .catch((error) => {
          console.error("Error saving message:", error);
          // Close the database connection on error
        });

        let notifications = await Notification.find({ to: data.to, seen: false })


        socket.to(data.to).emit("notify",notifications.length)
     }



    
 
     });


     //remove notification

     socket.on("remove_notification",async(data)=>{

      let x = await Notification.deleteOne({ to: data.to, from: data.from, pid: data.pid, type: data.type })
      let y = await  Notification.find({ to: data.to, seen: false })

      socket.to(data.to).emit("notification_removed",y.length)


     })

    // Send Message
    socket.on("send_message", (data) => {
      const newMessage = new Message({
        sender: data.sender,
        receiver: data.receiver,
        content: data.content,
        time: data.time,
        date: new Date(data.date),
      })

      // Save the new message to the database
      newMessage
        .save()
        .then((savedMessage) => {
          socket.to(data.receiver).emit("receive_message", savedMessage);
          console.log("Message saved:", savedMessage);
          // Close the database connection after saving
        })
        .catch((error) => {
          console.error("Error saving message:", error);
          // Close the database connection on error
        });

      console.log(data);

      
    })


    //calling sockets
    socket.on("outgoingCall",(data)=>{

    
         socket.to(data.id).emit("incomingCall1",data)
    })


    socket.on('endCall',(data)=>{
      console.log(data)
      console.log('end call')
      socket.to(data.fid).emit('endCall1',data)
    })

    socket.on('lineBusy',(id)=>{
        socket.to(id).emit('lineBusy1')
    })

    socket.on('rejectCall',(to)=>{
      socket.to(to).emit('rejectedCall')
    })

    socket.on('acceptCall',(to)=>{
      socket.to(to).emit('acceptedCall')
    })

    socket.on('joinCall',(data)=>{

      socket.to(data.fid).emit('joinCall1',data)
    })



  });
};
              