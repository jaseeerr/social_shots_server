const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://127.0.0.1:${process.env.DB_PORT}/socialshots`,{useNewUrlParser:true})

mongoose.connection.once('open',()=>console.log('database connection success')).on('error',error=>{
console.log(error);
})