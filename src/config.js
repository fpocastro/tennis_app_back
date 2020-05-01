const Cloud = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, '../tennis-app-273703-7e1ded8aa3a8.json');
const { Storage } = Cloud;
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: 'tennis-app-270301'
}) 

module.exports = storage;