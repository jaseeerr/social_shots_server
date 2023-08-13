const { Server } = require("socket.io");
const cors = require("cors");
const Message = require("../models/messageSchema");

// Export a function to create and configure the Socket.io server
module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`);

    // Join Chat
    socket.on("join_room", (data) => {
      socket.join(data);
   
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

    // Send Message
    socket.on("send_message", (data) => {
      const newMessage = new Message({
        sender: data.sender,
        receiver: data.receiver,
        content: data.content,
        time: data.time,
        date: new Date(data.date),
      });

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

      
    });
  });
};
              