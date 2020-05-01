const User = require('../models/User');

const getUsers = (latLng, maxDistance) => {
    var users;
    if (latLng && maxDistance) {
        users = User.find({
            lastLocation: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: latLng
                    },
                    $maxDistance: maxDistance
                }
            }
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