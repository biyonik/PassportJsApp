const {showMainPage} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware")
const router = require('express').Router();

router.get('/', authMiddleware.sessionStarted, showMainPage);


module.exports = router;
