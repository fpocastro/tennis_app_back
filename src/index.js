const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./api/auth_controller');
const usersRoute = require('./api/users_controller');
const placesRoute = require('./api/places_controller');
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

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data)
    })
});

http.listen(3000, () => console.log('Running on port 3000'));