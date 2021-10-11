const {
    loginForm,
    registerForm,
    forgot_passwordForm,
    loginPost,
    registerPost,
    forgot_passwordPost,
    logOut,
    verifyMail,
    newPasswordForm,
    newPassword
} = require("../controllers/authController");

const {
    validateNewUser, validateLogin, validateEmail, validatePassword
} = require('../middlewares/validationMiddleware');

const authMiddleware = require('../middlewares/authMiddleware');


const router = require('express').Router();


router.get('/login', authMiddleware.isLoggedIn, loginForm);

router.post('/login', [validateLogin(), authMiddleware.isLoggedIn], loginPost);

router.get('/register', authMiddleware.isLoggedIn, registerForm);

router.post('/register', [validateNewUser(), authMiddleware.isLoggedIn], registerPost);

router.get('/forgot_password', authMiddleware.isLoggedIn, forgot_passwordForm);

router.post('/forgot_password', [authMiddleware.isLoggedIn, validateEmail()], forgot_passwordPost);

router.get('/verify', verifyMail);

router.get('/reset_password/', newPasswordForm);

router.get('/reset_password/:id/:token', newPasswordForm);

router.post('/reset_password', validatePassword(), newPassword);

router.get('/logout', authMiddleware.sessionStarted, logOut);

module.exports = router;
