const sessionStarted = function (request, response, next) {
    if(request.isAuthenticated()) {
        return next();
    } else {
        request.flash('error', ['Erişim engellendi! Önce giriş yapmanız gerekmektedir.'])
        response.redirect('/login')
    }
}

const isLoggedIn = function (request, response, next) {
    if(!request.isAuthenticated()) {
        return next();
    } else {
        response.redirect('/admin')
    }
}



module.exports = {
    sessionStarted,
    isLoggedIn
}
