import { BadRequestException } from '@nestjs/common';

export async function sendSMS(phone: string, message: string) {
  try {
    const axios = require('axios');
    const FormData = require('form-data');
    const data = new FormData();
    data.append('mobile_phone', phone);
    data.append('message', message);
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://sms.sysdc.ru/index.php',
      headers: {
        ...data.getHeaders(),
        Authorization:
          'Bearer 0VODcOo6kWMdSs8IOnrCgxagqZeGcsbJTMn7RHFEX2auRodfK1CtsgS5BBe8fS0R',
      },
      data,
    };
    axios(config)
      .then(function (response: any) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error: any) {
        console.log(error);
      });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

export function orderCompleteSMSSchema(id) {
  return (
    'Sizning buyurtmangiz № ' +
    id +
    '. Tez fursatda kuryerimiz mahsulotlarni yetkazadi.'
  );
}
