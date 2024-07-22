const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setMinutes(expiry.getTime() + 30 * 60 * 1000);
  return { otp, expiry };
};

const onRequestOTP = async (otp: number, to: string) => {
  const accountSid = "AC7b2fa06a7c419715e15d4065d4d1f51f";
  const authToken = "019f3f6334ad9f8ab3555c401a41a3c0";
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+4741208668",
    to: to,
  });
};

export { generateOTP, onRequestOTP };
