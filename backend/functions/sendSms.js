const axios = require("axios");

const sendSms = async (phone_number, text) => {
  
    try {
      const data = await axios.request({url:"/auth/token", baseURL:"https://api.softgen.ge", method:"post", data:{
        username:process.env.sms_username,
        password: process.env.sms_password,
        clientId:process.env.clientId,
        clientSecret: process.env.clientSecret,
        grantType:process.env.grantType
      }}).then(data => data?.data);

      if (data?.accessToken) {
        await axios.post('https://api.softgen.ge/sms/',{
          token: data?.accessToken,
          messages: [
              {
                  phone: phone_number,
                  text: text
              }
          ]
      }).then(resp => {
          if(resp?.data?.[0]?.id){
            console.log(resp?.data?.[0]);
            return 'success'
          }
      })
      } else {
        return false
      }
    }
    catch (err) {
      return false
    }
}

module.exports = {
  sendSms
}
