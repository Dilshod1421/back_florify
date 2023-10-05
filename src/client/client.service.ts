import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { ClientDto } from './dto/client.dto';
import { PhoneDto } from 'src/admin/dto/phone.dto';
import { Otp } from 'src/admin/models/otp.model';
import { generate } from 'otp-generator';
import { sendOTP } from 'src/utils/sendOtp';
import { VerifyOtpDto } from 'src/admin/dto/verifyOtp.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client)
    private readonly clientRepository: typeof Client,
    @InjectModel(Otp)
    private readonly otpRepository: typeof Otp,
  ) {}

  async sendSMS(phoneDto: PhoneDto) {
    try {
      const code = generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      await sendOTP(phoneDto.phone, code);
      const expire_time = Date.now() + 120000;
      const exist = await this.otpRepository.findOne({
        where: { phone: phoneDto.phone },
      });
      if (exist) {
        const otp = await this.otpRepository.update(
          { code, expire_time },
          { where: { phone: phoneDto.phone }, returning: true },
        );
        return {
          message: 'Telefon raqamingizga tasdiqlash kodi yuborildi',
          code,
          otp,
        };
      }
      const otp = await this.otpRepository.create({
        code,
        phone: phoneDto.phone,
        expire_time,
      });
      return {
        message: 'Telefon raqamingizga tasdiqlash kodi yuborildi',
        code,
        otp,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(verifyOtpDto: VerifyOtpDto) {
    try {
      const check_phone = await this.otpRepository.findOne({
        where: { phone: verifyOtpDto.phone },
      });
      if (!check_phone) {
        throw new BadRequestException('Telefon raqamda xatolik!');
      }
      const now = Date.now();
      if (now > check_phone.expire_time) {
        check_phone.destroy();
        throw new BadRequestException(
          'Yuborilgan parol vaqti tugadi, iltimos telefon raqamni qaytadan kiritib, yangi parol oling!',
        );
      }
      if (verifyOtpDto.code != check_phone.code) {
        throw new BadRequestException('Tasdiqlash paroli xato!');
      }
      check_phone.destroy();
      const client = await this.clientRepository.create({
        phone: check_phone.phone,
      });
      return { message: 'Tizimga kirildi', client };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const clients = await this.clientRepository.findAll({
        include: { all: true },
      });
      return clients;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const clients = await this.clientRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.clientRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: clients,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return res;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const client = await this.clientRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!client) {
        throw new BadRequestException('Mijoz topilmadi!');
      }
      return client;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, clientDto: ClientDto) {
    try {
      const client = await this.findById(id);
      if (clientDto.phone) {
        const exist_phone = await this.clientRepository.findOne({
          where: { phone: clientDto.phone },
        });
        if (exist_phone) {
          if (client.id != exist_phone.id) {
            throw new BadRequestException('Bu telefon raqam band!');
          }
        }
      }
      const updated_info = await this.clientRepository.update(clientDto, {
        where: { id },
        returning: true,
      });
      return {
        message: "Mijoz ma'lumotlari tahrirlandi",
        client: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const client = await this.findById(id);
      client.destroy();
      return { message: "Mijoz o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
