const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255
    },
    fullAddress: {
        type: String,
        required: true
    },
    geo: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: Array,
            required: true
        }
    },
    email: {
        type: String,
        max: 255
    },
    phone: {
        type: String,
        max: 16
    },
    website: {
        type: String,
        max: 1024
    },
    pictureUrl: {
        type: String
    }
});

module.exports = mongoose.model('Place', placeSchema);