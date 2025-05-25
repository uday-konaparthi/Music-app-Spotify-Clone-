const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary.js');

 const songStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'music-app/songs',
    resource_type: 'video',
    format: async () => 'mp3',
  },
});

 const coverStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'music-app/covers',
    resource_type: 'image',
    format: async () => 'jpg',
  },
});

module.exports = {songStorage, coverStorage}