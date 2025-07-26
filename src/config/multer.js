const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(6).toString('hex');
    const filename = `${hash}-${file.originalname}`;
    cb(null, filename);
  },
});

module.exports = {
  storage,
};
