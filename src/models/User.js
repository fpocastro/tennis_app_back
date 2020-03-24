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
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    delete obj.date;
    return obj;
}

module.exports = mongoose.model('User', userSchema);