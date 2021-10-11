const {validationResult} = require('express-validator');
const UserModel = require('../models/userModel');
const passport = require("passport");
require('../config/passportLocalConfig')(passport);
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const loginForm = async function (request, response, next) {
    const errors = request.flash('error');
    await response.render('login', {layout: './layout/auth_layout', errors});
};

const loginPost = async function (request, response, next) {
    const errorsArray = validationResult(request);
    if (!errorsArray.isEmpty()) {
        request.flash('validation_errors', errorsArray.array())
        await response.redirect('/login');
    } else {
        await passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true
        })(request, response, next);
    }

}

const registerForm = async function (request, response, next) {
    await response.render('register', {
        layout: './layout/auth_layout',
        validation_errors: request.flash('validation_errors')
    });
};

const registerPost = async function (request, response, next) {
    const errorsArray = validationResult(request);
    if (!errorsArray.isEmpty()) {
        request.flash('validation_errors', errorsArray.array())
        await response.redirect('/register');
    } else {
        const user = await UserModel.findOne({email: request.body.email});
        if (user && user.isEmailActive === true) {
            request.flash('validation_errors', [{
                value: '',
                param: 'email',
                msg: 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılmakta!',
                location: 'body'
            }]);
            await response.redirect('/register');
        } else if ((user && user.isEmailActive === false) || user === null) {
            if (user) {
                await UserModel.findByIdAndRemove({_id: user._id});
            }
            const newUser = new UserModel({
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                email: request.body.email,
                password: await bcrypt.hash(request.body.password, 10)
            });
            await newUser.save();
            request.flash('error', ['Lütfen onaylama e-postası için e-posta kutunuzu kontrol ediniz.']);
            /**
             * Jwt actions
             */
            const jwtUserInfo = {
                id: newUser._id,
                email: newUser.email
            };
            const confirmMailToken = jwt.sign(jwtUserInfo, process.env.CONFIRM_MAIL_JWT_SECRET_KEY, {expiresIn: '1d'});
            /**
             * Mail sending actions
             */
            const webSiteUrl = `${process.env.WEB_SITE_URL}verify?id=${confirmMailToken}`;
            const transporter = nodeMailer.createTransport({
                service: process.env.CONFIRM_MAIL_SERVICE,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.CONFIRM_MAIL_USER,
                    pass: process.env.CONFIRM_MAIL_PASSWORD
                }
            });
            await transporter.sendMail({
                from: 'PassportApp <your_mail_address@service>',
                to: newUser.email,
                subject: 'Üyelik Onaylama',
                text: `E-postanızı onaylamak için lütfen bu linte tıklayın. ${webSiteUrl}`
            }, (error, info) => {
                if (error) {
                    console.log(error);
                }
                transporter.close();
            });
            await response.redirect('/login');
        }
    }
}

const forgot_passwordForm = async function (request, response, next) {
    await response.render('forgot_password', {layout: './layout/auth_layout'});
};

const forgot_passwordPost = async function (request, response, next) {
    const errorsArray = validationResult(request);
    if (!errorsArray.isEmpty()) {
        request.flash('validation_errors', errorsArray.array())
        await response.redirect('/forgot_password');
    } else {
        const user = await UserModel.findOne({email: request.body.email, isEmailActive: true});
        if (!user) {
            request.flash('validation_errors', [{
                value: '',
                param: 'email',
                msg: 'Bu e-posta adresi bir kullanıcıya tanımlı değil!',
                location: 'body'
            }]);
            await response.redirect('/forgot_password');
        } else {
            /**
             * Jwt actions
             */
            const jwtUserInfo = {
                id: user._id,
                email: user.email
            };
            const secret = `${process.env.RESET_PASSWORD_MAIL_JWT_SECRET_KEY}-${user.password}`;
            const resetMailToken = jwt.sign(jwtUserInfo, secret, {expiresIn: '1d'});
            /**
             * Mail sending actions
             */
            const webSiteUrl = `${process.env.WEB_SITE_URL}reset_password/${user._id}/${resetMailToken}`;
            const transporter = nodeMailer.createTransport({
                service: process.env.CONFIRM_MAIL_SERVICE,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.CONFIRM_MAIL_USER,
                    pass: process.env.CONFIRM_MAIL_PASSWORD
                }
            });
            await transporter.sendMail({
                from: 'PassportApp <your_mail_address@service>',
                to: user.email,
                subject: 'Parola Sıfırlama',
                text: `Parolanızı sıfırlamak için bu linke tıklayın: ${webSiteUrl}`
            }, (error, info) => {
                if (error) {
                    console.log(error);
                }
                transporter.close();
            });
            request.flash('error', ['Parola sıfırlamak için sıfırlama e-postası gönderildi. Lütfen e-posta kutunuzu kontrol ediniz!'])
            await response.redirect('/login');
        }
    }
}

const logOut = function (request, response, next) {
    request.logout();
    request.session.destroy((error) => {
        response.clearCookie('connect.sid');
        response.render('login', {layout: './layout/auth_layout', errors: {}});
    });

}

const verifyMail = function (request, response, next) {
    const token = request.query.id;
    if (token) {
        try {
            jwt.verify(token, process.env.CONFIRM_MAIL_JWT_SECRET_KEY, async (e, decoded) => {
                if (e) {
                    request.flash('error', ['Doğrulama kodu hatalı veya süresi geçmiş!']);
                } else {
                    const idInToken = decoded.id;
                    const emailInToken = decoded.email;
                    const result = await UserModel.findByIdAndUpdate(idInToken, {isEmailActive: true});
                    if (result) {
                        request.flash('error', ['Doğrulama işlemi başarılı! Giriş yapabilirsiniz']);
                    } else {
                        request.flash('error', ['Doğrulama işlemi yapılamadı! Lütfen tekrar kullanıcı kaydı oluşturun.']);
                    }
                    response.redirect('/login');
                }
            });
        } catch (err) {

        }
    } else {

    }
}

const newPasswordForm = async function (request, response, next) {
    const id = request.params.id;
    const token = request.params.token;

    if (id && token) {
        const foundedUser = await UserModel.findOne({_id: id});
        const secret = `${process.env.RESET_PASSWORD_MAIL_JWT_SECRET_KEY}-${foundedUser.password}`;
        try {
            jwt.verify(token, secret, async (e, decoded) => {
                if (e) {
                    request.flash('error', ['Sıfırlama kodu hatalı veya süresi dolmuş!']);
                    response.redirect('/forgot_password');
                } else {
                    response.render('new_password', {layout: './layout/auth_layout', id:id, token:token});
                }
            });
        } catch (err) {

        }
    } else {
        request.flash('error', ['Lütfen size gönderilen sıfırlama e-postasındaki linke tıklayın!']);
        response.redirect('/forgot_password');
    }
}

const newPassword = async function(request, response, next) {
    const link_id = request.body.link_id;
    const link_token = request.body.link_token;
    const link = `${link_id}/${link_token}`;
    const errorsArray = validationResult(request);
    if (!errorsArray.isEmpty()) {
        request.flash('validation_errors', errorsArray.array())
        await response.redirect(`/reset_password/${link}`);
    } else {
        try {
            const foundedUser = await UserModel.findOne({_id: link_id, isEmailActive: true});
            const secret = `${process.env.RESET_PASSWORD_MAIL_JWT_SECRET_KEY}-${foundedUser.password}`;
            jwt.verify(link_token, secret, async(e, decoded) => {
                if(e) {
                    request.flash('error', ['Kod hatalı veya parametre yanlış!']);
                    response.redirect(`/reset_password/${link}`);
                } else {
                    const password = request.body.password;
                    const newPassword = await bcrypt.hash(password, 10);
                    const passwordUpdateResult = await UserModel.findByIdAndUpdate(link_id, {
                        password: newPassword
                    });
                    if(passwordUpdateResult) {
                        request.flash('error', ['Parola sıfırlama işlemi başarılı']);
                        response.redirect('/login');
                    } else {
                        request.flash('error', ['Lütfen tekrar şifre sıfırlama talebinde bulunun!']);
                        response.redirect('/forgot_password');
                    }
                }
            });
        } catch(e) {
            console.log(e);
        }

    }
}

module.exports = {
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
}
