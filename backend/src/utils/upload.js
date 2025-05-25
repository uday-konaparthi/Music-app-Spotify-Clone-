const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === 'song') {
      return {
        folder: 'music-app/songs',
        resource_type: 'video',
        format: 'mp3',
      };
    } else if (file.fieldname === 'cover') {
      return {
        folder: 'music-app/covers',
        resource_type: 'image',
        format: 'jpeg',
      };
    }
  },
});

const upload = multer({ storage });

module.exports = upload;
