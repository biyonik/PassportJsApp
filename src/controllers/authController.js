const {validationResult} = require('express-validator');

const loginForm = async function (request ,response, next) {
    await response.render('login', {layout:'./layout/auth_layout'});
};

const loginPost = async function (request ,response, next) {

}

const registerForm = async function (request ,response, next) {
    await response.render('register', {layout:'./layout/auth_layout', validation_errors: request.flash('validation_errors')});
};

const registerPost = async function (request ,response, next) {
    const errorsArray = validationResult(request);
    if(!errorsArray.isEmpty()) {
        request.flash('validation_errors', errorsArray.array())
        await response.redirect('/register');
    }
}

const forgot_passwordForm = async function (request ,response, next) {
    await response.render('forgot_password', {layout:'./layout/auth_layout'});
};

const forgot_passwordPost = async function (request ,response, next) {

}

module.exports = {
    loginForm,
    registerForm,
    forgot_passwordForm,
    loginPost,
    registerPost,
    forgot_passwordPost
}
