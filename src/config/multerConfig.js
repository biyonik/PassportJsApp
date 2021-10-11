const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, path.resolve(__dirname, '../uploads/avatars'));
    },
    filename: function (request, file, callback) {
        const suffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        callback(null, `${request.user.email}${path.extname(file.originalname)}`);
    }
});

const fileFilter = function (request, file, callback) {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
