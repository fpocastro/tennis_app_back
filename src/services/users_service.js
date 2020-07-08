const User = require('../models/User');

const getUsers = (latLng, maxDistance, name) => {
    var users;
    if (latLng && maxDistance && name) {
        users = User.find({
            lastLocation: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: latLng
                    },
                    $maxDistance: maxDistance
                }
            },
            name: {$regex: name, $options: 'i'}
        });
    } else if (latLng && maxDistance) {
        users = User.find({
            lastLocation: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: latLng
                    },
                    $maxDistance: maxDistance
                }
            },
        });
    } else {
        users = User.find();
    }
    return users;
}

const getUser = (_id) => {
    return User.findById(_id);
}

const updateUser = (_id, user) => {
    return User.findByIdAndUpdate({
        _id: _id
    }, user, {
        new: true
    });
}

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;