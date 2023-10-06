import { HubtelSms } from 'hubtel-sms-extended';
import * as dotenv from 'dotenv';

dotenv.config();

const hubtelSms = new HubtelSms({
  clientId: process.env.HUBTEL_CLIENT_ID,
  clientSecret: process.env.HUBTEL_CLIENT_SECRET,
});

export const sendOtpMessage = (phone, otp) => {
  try {
    const data = hubtelSms.quickSend({
      From: 'Attendant',
      Content: `Your OTP code is ${otp}`,
      To: phone,
    });
    console.log(data);
  } catch (error) {
    throw error;
  }
};
