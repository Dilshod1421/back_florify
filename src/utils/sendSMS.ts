import { BadRequestException } from '@nestjs/common';

export async function sendSMS(phone: string, message: string) {
  try {
    const axios = require('axios');
    const FormData = require('form-data');
    const data = new FormData();
    data.append('mobile_phone', phone);
    data.append('message', message);
    data.append('from', 'florify');
    data.append('callback_url', 'http://0000.uz/test.php');
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://notify.eskiz.uz/api/message/sms/send',
      headers: {
        ...data.getHeaders(),
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDY1NTgwNjEsImlhdCI6MTcwMzk2NjA2MSwicm9sZSI6InVzZXIiLCJzdWIiOiI0NjM0In0.ABoefvDOltfazzDqLKZBxi0xgkChuMz4LBUMW95YwCc',
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

export function orderCompleteSMSSchema(id: number) {
  return (
    'Sizning buyurtmangiz № ' +
    id +
    '. Tez fursatda kuryerimiz mahsulotlarni yetkazadi.'
  );
}
