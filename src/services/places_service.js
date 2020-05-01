const Place = require('../models/Place');

const getPlaces = () => {
    return Place.find();
}

const getPlacesByDistance = (latLng, distance) => {
    return Place.find({
        geo: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: latLng
                },
                $maxDistance: distance
            }
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
module.exports.getPlacesByDistance = getPlacesByDistance;
module.exports.getPlace = getPlace;
module.exports.addPlace = addPlace;
module.exports.updatePlace = updatePlace;