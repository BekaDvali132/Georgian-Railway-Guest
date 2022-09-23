const { errorsObjectFormatter } = require("../middleware/errorsFormatter");
const { validationResult } = require("express-validator");
const { sendVerificationCode } = require("../functions/sendEmail");
const pool = require("../database/db");
const moment = require('moment')
// @desc    Send Code to Email
// @route   POST /api/verify/email
// @access  Private
const verifyEmail = async (req, res) => {

  errorsObjectFormatter(req, res);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const { email } = req.body;

  const codeExists = await pool.query('Select * from verification_codes where email = $1', [email]);

  if (codeExists.rows?.[0]) {
    await pool.query('Delete From verification_codes where id = $1', [codeExists.rows?.[0]?.id]);
  }

  const code = Math.floor(1000 + Math.random() * 9000);

  await pool.query("INSERT INTO verification_codes (code, email) VALUES ($1,$2)",[code, email])

  sendVerificationCode(email, code);

  res.status(200).json({
    status: "success",
  });
};

// @desc    Verify Email Code
// @route   POST /api/verify/email-check
// @access  Private
const verifyEmailCode = async (req, res) => {

    errorsObjectFormatter(req, res);
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    const { code, email } = req.body;

    const savedCode = await pool.query("Select * from verification_codes where code = $1 AND email = $2",[code, email])

    if (savedCode?.rows?.[0]) {
        res.status(200).json({
            status: "success",
            // data: moment().isBetween(moment(savedCode.rows[0].created_at), moment(savedCode.rows[0].valid_until))
          });

        await pool.query('DELETE FROM verification_codes WHERE id = $1',[savedCode?.rows[0].id])

    } else {
        res.status(200).json({
            errors:{
                code:'კოდი არასწორია'
            }
        })
    }
}

module.exports = { verifyEmail, verifyEmailCode };
