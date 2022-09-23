const {sendVerificationCode} = require('./sendEmail')

const verifyEmail = (req,res) => {
    const {email} = req.body;
  
    const code = Math.floor(1000 + Math.random() * 9000);
  
    sendVerificationCode(email, code);
  
    res.status(200).json({
      status: 'success'
    })
  
  }

  module.exports = {verifyEmail}
