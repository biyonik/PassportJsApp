const {
    loginForm,
    registerForm,
    forgot_passwordForm,
    loginPost,
    registerPost,
    forgot_passwordPost
} = require("../controllers/authController");

const {
    validateNewUser
} = require('../middlewares/validationMiddleware');

const router = require('express').Router();

router.get('/login', loginForm);

router.post('/login', loginPost);

router.get('/register', registerForm);

router.post('/register', validateNewUser(), registerPost);

router.get('/forgot_password', forgot_passwordForm);

router.post('/forgot_password', forgot_passwordPost);

module.exports = router;
