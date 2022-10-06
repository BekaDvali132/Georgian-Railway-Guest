const check = require('express-validator/check')

const verifyPasswordsMatch = (req, res, next) => {
    const {repeat_password} = req.body

    return check('password')
      .isLength({ min: 4 })
      .withMessage('password must be at least 4 characters')
      .equals(repeat_password)
}

exports.module = {verifyPasswordsMatch}