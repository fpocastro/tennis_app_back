const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        max: 255
    },
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model('Message', messageSchema);