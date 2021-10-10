const {
    loginForm,
    registerForm,
    forgot_passwordForm,
    loginPost,
    registerPost,
    forgot_passwordPost, logOut
} = require("../controllers/authController");

const {
    validateNewUser, validateLogin
} = require('../middlewares/validationMiddleware');

const authMiddleware = require('../middlewares/authMiddleware');

const router = require('express').Router();



router.get('/login', authMiddleware.isLoggedIn, loginForm);

router.post('/login', [validateLogin(), authMiddleware.isLoggedIn],loginPost);

router.get('/register', authMiddleware.isLoggedIn, registerForm);

router.post('/register', [validateNewUser(), authMiddleware.isLoggedIn], registerPost);

router.get('/forgot_password', authMiddleware.isLoggedIn, forgot_passwordForm);

router.post('/forgot_password', authMiddleware.isLoggedIn, forgot_passwordPost);

router.get('/logout', authMiddleware.sessionStarted, logOut);

module.exports = router;
