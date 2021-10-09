const {body} = require('express-validator');

const validateNewUser = function () {
    return [
        body('firstname')
            .trim()
            .isLength({min:2}).withMessage('İsim minimum 2 karakter olmalıdır!')
            .isLength({max:32}).withMessage('İsim maksimum 32 karakter olabilir!'),
        body('lastname')
            .trim()
            .isLength({min:2}).withMessage('Soyisim minimum 2 karakter olmalıdır!')
            .isLength({max:32}).withMessage('Soyisim maksimum 32 karakter olabilir!'),
        body('email')
            .trim()
            .isEmail().withMessage('Lütfen geçerli bir e-posta adresi giriniz!'),
        body('password')
            .trim()
            .isLength({min:6}).withMessage('Parola minimum 6 karakter olmalıdır!')
            .isLength({max:16}).withMessage('Parola maksimum 16 karakter olabilir!'),
        body('password_confirm')
            .trim()
            .isLength({min:6}).withMessage('Parola tekrar minimum 6 karakter olmalıdır!')
            .isLength({max:16}).withMessage('Parola tekrar maksimum 16 karakter olabilir!')
    ];
}

module.exports = {
    validateNewUser
}
