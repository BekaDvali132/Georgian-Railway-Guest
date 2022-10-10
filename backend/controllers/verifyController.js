const { errorsObjectFormatter } = require("../middleware/errorsFormatter");
const { validationResult } = require("express-validator");
const { sendVerificationCode } = require("../functions/sendEmail");
const pool = require("../database/db");
const {sendSms} = require('../functions/sendSms')

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

// @desc    Send Code to Phone
// @route   POST /api/verify/phone
// @access  public
const verifyPhone = async (req, res) => {

  errorsObjectFormatter(req, res);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const { phone_number } = req.body;

  const codeExists = await pool.query('Select * from verification_codes where phone_number = $1', [phone_number]);

  if (codeExists.rows?.[0]) {
    await pool.query('Delete From verification_codes where id = $1', [codeExists.rows?.[0]?.id]);
  }

  const code = Math.floor(1000 + Math.random() * 9000);

  await pool.query("INSERT INTO verification_codes (code, phone_number) VALUES ($1,$2)",[code, phone_number])

  const sent = await sendSms(phone_number, code);
  if (sent !== false) {
    res.status(200).json({
      status: 'success',
    });
  } else {
    res.status(200).json({
      status: 'fail',
    });
  }
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

// @desc    Verify Phone Code
// @route   POST /api/verify/sms-check
// @access  Public
const verifyPhoneCode = async (req, res) => {

  errorsObjectFormatter(req, res);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  const { code, phone_number } = req.body;

  const savedCode = await pool.query("Select * from verification_codes where code = $1 AND phone_number = $2",[code, phone_number])

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

module.exports = { verifyEmail, verifyEmailCode, verifyPhone, verifyPhoneCode };
