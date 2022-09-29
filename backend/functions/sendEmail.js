let nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = (email, role, name, surname, generatedPassword) => {
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "თქვენ წარმატებით დარეგისტრირდით CRM-ზე",
    text: `თქვენ გაქვთ მინიჭებული ${
      role == 1 ? "ადმინისტრატორის" : "მენეჯერის"
    } როლი. თქვენი მონაცემებია 
              სახელი: ${name} გვარი: ${surname} ელ.ფოსტა: ${email} პაროლი: ${generatedPassword}`, // plain text body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("email Sent");
    }
  });
};

const sendCodeMail = (email,code) => {

  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "პაროლის აღდგენის გვერდი",
    text: `პაროლის აღსადგენად გადადით ბმულზე https://crm-app-scope.herokuapp.com/recover-password/${code}`, // plain text body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("email Sent");
    }
  });

}

const sendNewPasswordMail = (email, name, generatedPassword) => {
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "თქვენ წარმატებით აღიდგინდათ პაროლი GR-ზე",
    text: `თქვენი მონაცემებია დასახელება: ${name} ელ.ფოსტა: ${email} პაროლი: ${generatedPassword}`, // plain text body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("email Sent");
    }
  });
};

const sendVerificationCode = (email, code) => {
    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "თქვენი სავერიფიკაციო კოდი",
      text: `თქვენი სავერიფიკაციო კოდია ${code}`, // plain text body
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email Sent");
      }
    });
  };

module.exports = { sendMail, sendCodeMail, sendNewPasswordMail, sendVerificationCode };