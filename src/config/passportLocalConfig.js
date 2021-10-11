const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const path = require('path');

module.exports = async function (passport) {
    const strategyOptions = {
        usernameField: 'email',
        passwordField: 'password'
    }

    passport.use(new LocalStrategy(strategyOptions, async function (email, password, done) {
        try {
            const foundedUser = await UserModel.findOne({email: email});
            if (!foundedUser) {
                return await done(null, false, {message: 'Sistemde bu e-posta adresine tanımlı kullanıcı bulunamadı!'})
            }

            const passwordControl = await bcrypt.compareSync(password, foundedUser.password);
            if (!passwordControl) {
                return await done(null, false, {message: 'E-posta veya şifre hatalı!'})
            } else {
                if (foundedUser && foundedUser.isEmailActive === false) {
                    return await done(null, false, {message: 'Lütfen e-posta adresinizi onaylayın!'});
                } else {
                    return await done(null, foundedUser);
                }
            }
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser(async function (user, done) {
        await done(null, user);
    });

    passport.deserializeUser(async function (id, done) {
        await UserModel.findById(id, async function (err, user) {
            const newUser = {
                _id:user._id,
                email:user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                password: user.password,
                avatar: user.avatar
            }
            await done(err, user);
        });
    })
}

