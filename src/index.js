const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./api/auth_controller');
const usersRoute = require('./api/users_controller');
const placesRoute = require('./api/places_controller');
const chatsRoute = require('./api/chats_controller');
const faqsRoute = require('./api/faqs_controller');
const cors = require('cors');
const http = require('http').createServer(app)
const io = require('socket.io')(http);

app.use(cors());

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to db')).catch(err => console.log(`Error connecting to db:`, err));

app.use(express.json());

app.get('/', (req, res) => {
    res.send({status: 'Node server running... TennisApp'});
});
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/places', placesRoute);
app.use('/api/chats', chatsRoute);
app.use('/api/faqs', faqsRoute);

var users = {};
const chatsService = require('./services/chats_service');
io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.conn.request.headers._id}`);
    var userId = socket.conn.request.headers._id;

    if (!(userId in users)) {
        console.log('Adding user to users');
        users[userId] = socket;
    }

    socket.on('send_message', async (data) => {  
        try {
            data.message.time = Date.now();
            const response = await chatsService.addMessage(data.message);
            if (users[data.receiverId]) {
                io.to(users[data.receiverId].emit('receive_message', data.message));
            }
        } catch (err) {
            console.log(err);
        }
        
        
    });

    socket.on('disconnect', (data) => {
        console.log(data);
        console.log('A user disconnected');
        delete users[userId];
    });
});



http.listen(3000, () => console.log('Running on port 3000'));