const Place = require('../models/Place');

const getPlaces = (latLng, maxDistance) => {
    var places;
    if (latLng && maxDistance) {
        places = Place.find({
            geo: {
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
        places = Place.find();
    }
    return places
}

const getPlacesByIds = (ids) => {
    return Place.find({
        _id: {
            '$in': ids
        }
    });
}

const getPlace = (_id) => {
    return Place.findById(_id);
}

const addPlace = async (place) => {
    const placeObj = new Place(place);
    return placeObj.save();
}

const updatePlace = (_id, place) => {
    return Place.findByIdAndUpdate({
        _id: _id
    }, place, {
        new: true
    });
}

module.exports.getPlaces = getPlaces;
module.exports.getPlacesByIds = getPlacesByIds;
module.exports.getPlace = getPlace;
module.exports.addPlace = addPlace;
module.exports.updatePlace = updatePlace;