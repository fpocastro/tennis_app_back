const Event = require('../models/Event');
const mongoose = require('mongoose');
const Match = require('../models/Match');

const getEventsByCreator = async (creatorId) => {
    var events = await Event.find({
        creator: creatorId
    }).populate('creator participants').populate('place').populate('groups.rounds.matches').populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'creator',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'teamOne',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'teamTwo',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'possiblePlaces',
            model: 'Place',
        }
    });

    return events;
}

const getEventsByParticipant = async (participantId) => {
    var events = await Event.find({
        participants: {
            $in: [participantId]
        }
    }).populate('creator participants').populate('place').populate('groups.rounds.matches').populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'creator',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'teamOne',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'teamTwo',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'possiblePlaces',
            model: 'Place',
        }
    });

    return events;
}

const getEvent = async (eventId) => {
    var event = await Event.findById(eventId).populate('creator participants').populate('place').populate('groups.rounds.matches').populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'creator',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'teamOne',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'teamTwo',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'possiblePlaces',
            model: 'Place',
        }
    });

    return event;
}

const createEvent = async (event) => {
    const eventObj = new Event(event);
    return await eventObj.save().then(m => m.populate('creator participants').populate('place').populate('groups.rounds.matches').execPopulate()).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'creator',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'teamOne',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'teamTwo',
            model: 'User',
        }
    }).populate({
        path: 'groups.rounds.matches',
        populate: {
            path: 'possiblePlaces',
            model: 'Place',
        }
    });
}

const addParticipant = async (eventId, creatorId, participantId) => {
    var event = await Event.findOneAndUpdate({
        _id: eventId,
        creator: creatorId,
        participants: {
            $ne: participantId
        }
    }, {
        $push: {
            participants: participantId
        }
    }).populate('creator participants').populate('place').populate('groups.rounds.matches');

    return event;
}

const removeParticipant = async (eventId, creatorId, participantId) => {
    var event = await Event.findOneAndUpdate({
        _id: eventId,
        creator: creatorId
    }, {
        $pullAll: {
            participants: [participantId]
        }
    }).populate('creator participants').populate('place').populate('groups.rounds.matches');

    return event;
}

const addGroup = async (eventId, name, creatorId) => {
    var event = await Event.findOneAndUpdate({
        _id: eventId,
        creator: creatorId
    }, {
        $push: {
            groups: {
                name: name,
                rounds: []
            }
        }
    }).populate('creator participants').populate('place').populate('groups.rounds.matches');

    return event;
}

const removeGroup = async (eventId, groupId, creatorId) => {
    var event = await Event.findOneAndUpdate({
        _id: eventId,
        creator: creatorId
    }, {
        $pull: {
            groups: {
                _id: groupId
            }
        }
    }).populate('creator participants').populate('place').populate('groups.rounds.matches');

    return event;
}

const addRound = async (eventId, groupId, name, creatorId) => {
    const id = mongoose.Types.ObjectId();
    var event = await Event.findOneAndUpdate({
        _id: eventId,
        creator: creatorId,
        'groups._id': groupId
    }, {
        $push: {
            'groups.$.rounds': {
                _id: id,
                name: name,
                matches: []
            }
        }
    }).populate('creator participants').populate('place').populate('groups.rounds.matches');

    return id;
}

const removeRound = async (roundId, creatorId) => {
    var event = await Event.findOneAndUpdate({
        creator: creatorId,
        'groups.rounds._id': roundId
    }, {
        $pull: {
            'groups.$.rounds': {
                _id: roundId
            }
        }
    }).populate('creator participants').populate('place').populate('groups.rounds.matches');

    return event;
}

const addMatch = async (matchObj, groupId, roundId, creatorId) => {
    const id = mongoose.Types.ObjectId();
    matchObj._id = id;
    console.log(id)
    const match = new Match(matchObj);
    const savedMatch = await match.save().then(m => m.populate('creator teamOne teamTwo').populate('matchPlace possiblePlaces').execPopulate());
    try {
        await Event.findOneAndUpdate({
            creator: creatorId,
            'groups._id': groupId,
            'groups.rounds._id': roundId
        }, {
            $push: {
                'groups.0.rounds.0.matches': id
            }
        });
    } catch (err) {
        console.log(err)
        await Match.findOneAndDelete({
            _id: id
        });
        throw ('Error when saving match');
    }

    return savedMatch;
}

const removeMatch = async (roundId, matchId, creatorId) => {
    await Event.findOneAndUpdate({
        creator: creatorId,
        'groups.rounds._id': roundId
    }, {
        $pull: {
            'groups.0.rounds.0.matches': {
                _id: matchId
            }
        }
    }).populate('creator participants').populate('place').populate('groups.rounds.matches');

    var match = await Match.findOneAndDelete({
        _id: matchId,
        creator: creatorId,
        private: true
    });

    return match;
}

module.exports.getEventsByCreator = getEventsByCreator;
module.exports.getEventsByParticipant = getEventsByParticipant;
module.exports.getEvent = getEvent;
module.exports.createEvent = createEvent;
module.exports.addParticipant = addParticipant;
module.exports.removeParticipant = removeParticipant;
module.exports.addGroup = addGroup;
module.exports.removeGroup = removeGroup;
module.exports.addRound = addRound;
module.exports.removeRound = removeRound;
module.exports.addMatch = addMatch;
module.exports.removeMatch = removeMatch;