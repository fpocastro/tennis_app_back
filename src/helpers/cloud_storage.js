const fs = require('fs');
const gc = require('../config');
const bucket = gc.bucket('tennis-app-bucket');

const uploadFile = async (name, file, folder) => {
    fs.writeFileSync(name, file, {
        encoding: 'base64'
    });

    await bucket.upload(name, {
        destination: `images/${folder}/` + name,
        uploadType: 'media',
        metadata: {
            contentType: 'image/png'
        }
    });

    fs.unlinkSync(name);

    return `https://storage.googleapis.com/${bucket.name}/images/${folder}/${name}?updatedDate=${Date.now().toString()}`;
}

module.exports.uploadFile = uploadFile;