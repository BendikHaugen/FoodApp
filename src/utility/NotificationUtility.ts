require("dotenv").config();

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setMinutes(expiry.getTime() + 30 * 60 * 1000);
  return { otp, expiry };
};

const onRequestOTP = async (otp: number, to: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: phoneNumber,
    to: to,
  });
};

export { generateOTP, onRequestOTP };
