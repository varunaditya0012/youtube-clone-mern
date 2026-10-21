const multer = require('multer');
const path = require('path');
const fs = require('fs');

const videoDir = path.join(__dirname, '..', 'uploads', 'videos');
const thumbDir = path.join(__dirname, '..', 'uploads', 'thumbnails');

[videoDir, thumbDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.fieldname === 'video') {
      cb(null, videoDir);
    } else if (file.fieldname === 'thumbnail') {
      cb(null, thumbDir);
    } else {
      cb(null, thumbDir);
    }
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    const allowed = /\.(mp4|webm|mov|mkv|ogg)$/i;
    if (file.originalname.match(allowed)) {
      return cb(null, true);
    }
    return cb(new Error('Only video files (.mp4, .webm, .mov, .mkv) are allowed for video upload!'), false);
  } else if (file.fieldname === 'thumbnail') {
    const allowed = /\.(jpg|jpeg|png|webp|gif)$/i;
    if (file.originalname.match(allowed)) {
      return cb(null, true);
    }
    return cb(new Error('Only image files (.jpg, .jpeg, .png, .webp) are allowed for thumbnail!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 150 * 1024 * 1024 // 150MB max file size
  },
  fileFilter
});

module.exports = upload;
