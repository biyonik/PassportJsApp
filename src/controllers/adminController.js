const UserModel = require('../models/userModel');

const showMainPage = async function (request ,response, next) {
    await response.render('index', {layout: './layout/admin_layout'});
}

const showProfilePage = async function (request ,response, next) {
    await response.render('profile', {layout: './layout/admin_layout', user:request.user});
}

const updateProfile = async function (request ,response, next) {
    const updatedInfo = {
        firstname: request.body.firstname,
        lastname: request.body.lastname
    }
    try {
        if(request.file) {
            updatedInfo.avatar = request.file.filename;
        }
        const result = await UserModel.findByIdAndUpdate(request.user._id, updatedInfo);
        if(result) {
            response.redirect('/admin/profile');
        }
    } catch(e) {
        console.log(e);
    }
}

module.exports = {
    showMainPage,
    showProfilePage,
    updateProfile
}
