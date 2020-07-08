const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: 'open'
    },
    private: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    groups: [{
        name: {
            type: String,
            required: true
        },
        rounds: [{
            name: {
                type: String,
                required: true
            },
            matches: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Match',
                default: []
            }]
        }]
    }],
    creationDate: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Event', eventSchema);