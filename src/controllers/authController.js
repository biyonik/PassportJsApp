const {validationResult} = require('express-validator');
const UserModel = require('../models/userModel');
const passport = require("passport");
require('../config/passportLocalConfig')(passport);

const loginForm = async function (request ,response, next) {
    const errors = request.flash('error');
    await response.render('login', {layout:'./layout/auth_layout', errors});
};

const loginPost = async function (request ,response, next) {
    const errorsArray = validationResult(request);
    if(!errorsArray.isEmpty()) {
        request.flash('validation_errors', errorsArray.array())
        await response.redirect('/login');
    } else {
        await passport.authenticate('local', {
            successRedirect:'/admin',
            failureRedirect:'/login',
            failureFlash:true
        })(request, response, next);
    }

}

const registerForm = async function (request ,response, next) {
    await response.render('register', {layout:'./layout/auth_layout', validation_errors: request.flash('validation_errors')});
};

const registerPost = async function (request ,response, next) {
    const errorsArray = validationResult(request);
    if (!errorsArray.isEmpty()) {
        request.flash('validation_errors', errorsArray.array())
        await response.redirect('/register');
    } else {
        const user = await UserModel.findOne({email: request.body.email});
        if (user) {
            request.flash('validation_errors', [{
                value: '',
                param: 'email',
                msg: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılmakta!',
                location: 'body'
            }]);
            await response.redirect('/register');
        } else {
            const newUser = new UserModel({
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                email: request.body.email,
                password: request.body.password
            });
            await newUser.save();
            await response.redirect('/login');
        }
    }
}

const forgot_passwordForm = async function (request ,response, next) {
    await response.render('forgot_password', {layout:'./layout/auth_layout'});
};

const forgot_passwordPost = async function (request ,response, next) {

}

const logOut = function (request ,response, next) {
    request.logout();
    request.session.destroy((error) => {
        response.clearCookie('connect.sid');
        response.render('login', {layout:'./layout/auth_layout', errors: {}});
    });

}

module.exports = {
    loginForm,
    registerForm,
    forgot_passwordForm,
    loginPost,
    registerPost,
    forgot_passwordPost,
    logOut
}
