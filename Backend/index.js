const connectToMongo  = require('./db');
connectToMongo();  
var cors = require('cors')
const express = require('express') 
const app = express()
const cron = require('node-cron');
const Ride = require("./models/Rides");
const port = 5000


const http = require('http');
const socketIO = require('socket.io');


const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
require('./socket')(io);
app.use(express.json()) 
app.use(cors())

app.use('/api/signup',require('./routes/adduser')) 
app.use('/api/login',require('./routes/login')) 
app.use('/api/deleteuser',require('./routes/deleteuser'))
app.use('/api/addride',require('./routes/addride'))
app.use('/api/fetchrides',require('./routes/fetchrides'))
app.use('/api/updateride',require('./routes/updateride'))
app.use('/api/deleteride',require('./routes/deleteride'))
app.use('/api/resetpassword',require('./routes/resetpassword'))
app.use('/api/forgotpassword',require('./routes/forgotpassword'))
app.use('/api/searchresults',require('./routes/searchresults'))
app.use('/api/addUserMessage',require('./routes/addUserMessage'))
cron.schedule('0 0 * * *', async () => { 
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0); 
    
    const result = await Ride.deleteMany({ date: now });
    
    console.log(`Deleted ${result.deletedCount} rides scheduled for today.`);
  } catch (error) {
    console.error('Error while deleting rides:', error);
  }
});



server.listen(port, () => {
  console.log(`drivepool Backend listening on port ${port}`)
})