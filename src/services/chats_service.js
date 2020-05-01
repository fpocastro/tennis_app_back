const Chat = require('../models/Chat');

const getChatsByUser = async (userId) => {
    var chats = await Chat.find({
        usersId: {
            '$in': [userId]
        }
    }, {
        'messages': {
            '$slice': -1
        }
    });

    return chats
}

const getChat = (usersId) => {
    return Chat.findOne({
        usersId: {
            '$all': usersId
        }
    });
}

const addMessage = async (message) => {
    const chatId = message.senderId < message.receiverId ? message.senderId + message.receiverId : message.receiverId + message.senderId;
    const chat = await getChat([message.senderId, message.receiverId]);

    if (!chat) {
        var newChat = new Chat({
            usersId: [message.senderId, message.receiverId],
            messages: []
        });
        await newChat.save();
    }

    return Chat.update({
        usersId: {
            '$all': [message.senderId, message.receiverId]
        }
    }, {
        $push: {
            messages: message
        }
    }, {
        upsert: true
    });
}

module.exports.getChat = getChat;
module.exports.addMessage = addMessage;
module.exports.getChatsByUser = getChatsByUser;