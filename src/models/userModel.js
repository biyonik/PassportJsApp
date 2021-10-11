const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'Bu alan boş bırakılamaz!'],
        trim: true,
        min:[2, 'Bu alan minimum 2 karakter olmalıdır!'],
        max:[32, 'Bu alan maksimum 32 karakter olabilir!']
    },
    lastname: {
        type: String,
        required: [true, 'Bu alan boş bırakılamaz!'],
        trim: true,
        min:[2, 'Bu alan minimum 2 karakter olmalıdır!'],
        max:[32, 'Bu alan maksimum 32 karakter olabilir!']
    },
    email: {
        type: String,
        required: [true, 'Bu alan boş bırakılamaz!'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, 'Lütfen geçerli bir e-posta adresi giriniz!'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Lütfen geçerli bir e-posta adresi giriniz!']
    },
    isEmailActive: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Bu alan boş bırakılamaz!'],
        trim: true,
        min: [6, 'Bu alan minimum 6 karakter olmalıdır!'],
        max: [16, 'Bu alan maksimum 16 karakter olabilir!']
    }
}, {
    collection: 'users',
    timestamps: true
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
