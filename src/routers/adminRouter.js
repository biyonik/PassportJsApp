const {showMainPage, showProfilePage, updateProfile} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware")
const router = require('express').Router();
const multerConfig = require('../config/multerConfig');

router.get('/', authMiddleware.sessionStarted, showMainPage);
router.get('/profile', authMiddleware.sessionStarted, showProfilePage);
router.post('/update_profile', authMiddleware.sessionStarted, multerConfig.single('avatar'), updateProfile);

module.exports = router;
