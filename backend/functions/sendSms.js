const axios = require("axios");

const sendVerificationSms = async (req,res,next) => {
  
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
                  phone: "599505906",
                  text: "sms"
              }
          ]
      }).then(resp => {
          if(resp?.data?.[0]?.id){
            res.json({
              status:'success'
            })
          }
      })
      } else {
        res.json({status:'fail'})
      }
    }
    catch (err) {
      res.json({status:'fail'})
    }
}

module.exports = {
    sendVerificationSms
}
