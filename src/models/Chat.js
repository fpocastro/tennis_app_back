const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    usersId: [
        {
            type: String,
            required: true
        }
    ],
    user: {
        type: Object
    },
    messages: [
        {
            text: {
                type: String,
                required: true
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
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Chat', chatSchema);