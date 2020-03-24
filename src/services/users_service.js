const User = require('../models/User');

const getUsers = () => {
    return User.find();
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