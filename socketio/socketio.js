const {Server} = require('socket.io');
const cors = require('cors')

// Export a function to create and configure the Socket.io server
module.exports = function(server) {
  const io = new Server(server,{
     cors:{
        origin:"http:localhost:1234"
     }
  })

  io.on('connection', (socket) => {

    console.log(`A user connected ${socket.id}`);

    socket.on('disconnect', () => {
      console.log('A user disconnected'); 
    })

    socket.on('send_message',(data)=>{
        console.log(data)
    })



  })
};
