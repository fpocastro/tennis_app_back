const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    dateOfBirth: {
        type: Date
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    laterality: {
        type: String
    },
    backhand: {
        type: String
    },
    court: {
        type: String
    },
    pictureUrl: {
        type: String
    },
    level: {
        type: Number,
        default: 0
    },
    lastLocation: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: Array,
            default: [0, 0],
            required: true
        }
    },
    level: {
        type: Number,
    },
    playersSearchDistance: {
        type: Number,
        default: 5
    },
    placesSearchDistance: {
        type: Number,
        default: 5
    },
    introduction: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const userAccountInfoSchema = new mongoose.Schema({
    level: {
        type: Number,
    },
    playersSearchDistance: {
        type: Number,
        default: 5
    },
    placesSearchDistance: {
        type: Number,
        default: 5
    }
});

userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    delete obj.date;
    delete obj.lastLocation;
    return obj;
}

module.exports = mongoose.model('User', userSchema);