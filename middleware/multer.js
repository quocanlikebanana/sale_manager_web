const path = require('path');
const multer = require('multer');

const multerStorageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/test');
    },
    filename: (req, file, cb) => {
        const name = Date.now() + path.extname(file.originalname);
        cb(null, name);
    },
});
const upload = multer({ storage: multerStorageConfig });
module.exports = { upload };