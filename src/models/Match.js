const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
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
    numberOfPlayers: {
        type: Number,
        default: 2
    },
    teamOne: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    teamTwo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    creationDate: {
        type: Date,
        default: Date.now
    },
    matchDate: {
        type: Date,
        required: true
    },
    possiblePlaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        default: []
    }],
    matchPlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
    },
    score: {
        sets: [{
            type: Object,
            default: []
        }]
    }
});

module.exports = mongoose.model('Match', matchSchema);