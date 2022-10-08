let axios = require('axios');

let auth = {
  host: "api.softgen.ge",
  path: "/auth",
};

let send = {
  host: "api.softgen.ge",
  path: "/sms",
};

const sendVerificationSms = () => {
    console.log('hjelo');
    axios.default.post('https://api.softgen.ge/sms',{

    }).then(res => {
        console.log(res);
    })
}

module.exports = {
    sendVerificationSms
}
