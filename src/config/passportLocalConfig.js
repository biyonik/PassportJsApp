const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/userModel');

module.exports = async function(passport) {
    const strategyOptions = {
        usernameField: 'email',
        passwordField: 'password'
    }
    passport.use(new LocalStrategy(strategyOptions, async function(email, password, done) {
        const foundedUser = await UserModel.findOne({email: email});
        if(!foundedUser) {
            await done(null, false, {message: 'Sistemde bu e-posta adresine tanımlı kullanıcı bulunamadı!'})
        }
        if(foundedUser.password !== password) {
            await done(null, false, {message: 'E-posta veya şifre hatalı!'})
        }
        await done(null, foundedUser);
    }));

    passport.serializeUser(async function(user, done) {
        await done(null, user);
    });

    passport.deserializeUser(async function (id, done) {
        await UserModel.findById(id, async function (err, user) {
            await done(err, user);
        });
    })
}

