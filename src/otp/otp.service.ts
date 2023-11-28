import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Otp } from './models/otp.model';
import { PhoneDto } from './dto/phone.dto';
import { generate } from 'otp-generator';
import { sendSMS } from 'src/utils/sendSMS';
import { VerifyOtpDto } from './dto/verifyOtp.dto';

@Injectable()
export class OtpService {
  constructor(@InjectModel(Otp) private otpRepository: typeof Otp) {}

  async sendOTP(phoneDto: PhoneDto) {
    try {
      const { phone } = phoneDto;
      const code = generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      await sendSMS(phone, code);
      const expire_time = Date.now() + 130000;
      const exist = await this.otpRepository.findOne({
        where: { phone },
      });
      if (exist) {
        const otp = await this.otpRepository.update(
          { code, expire_time },
          { where: { phone }, returning: true },
        );
        return {
          message: 'Telefon raqamingizga tasdiqlash kodi yuborildi',
          otp: otp[1][0],
          statusCode: HttpStatus.OK,
        };
      }
      const otp = await this.otpRepository.create({
        code,
        phone,
        expire_time,
      });
      return {
        message: 'Telefon raqamingizga tasdiqlash kodi yuborildi',
        otp,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const { phone, code } = verifyOtpDto;
      const check = await this.otpRepository.findOne({
        where: { phone },
      });
      if (!check) {
        return {
          message: 'Telefon raqam topilmadi!',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
      const now = Date.now();
      if (now >= check.expire_time) {
        check.destroy();
        return {
          message: 'Sizga yuborilgan parol vaqti tugagan!',
          statusCode: HttpStatus.UNAUTHORIZED,
        };
      }
      if (code != check.code) {
        return {
          message: 'Parol tasdiqlanmadi!',
          statusCode: HttpStatus.FORBIDDEN,
        };
      }
      check.destroy();
      return {
        message: 'Parol tasdiqlandi',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
