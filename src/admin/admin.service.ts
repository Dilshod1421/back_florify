import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './models/admin.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { compare, hash } from 'bcryptjs';
import { NewPasswordAdminDto } from './dto/newPassword-admin.dto';
import { PhoneAdminDto } from './dto/phone-admin.dto';
import { generate } from 'otp-generator';
import { sendOTP } from 'src/utils/sendOtp';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private adminRepository: typeof Admin,
    private readonly jwtService: JwtService,
  ) {}

  async checkPhone(phoneDto: PhoneAdminDto) {
    try {
      const otp = generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      await sendOTP(phoneDto.phone, otp);
      return { message: 'Telefon raqamingizga tasdiqlash kodi yuborildi', otp };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(createAdminDto: CreateAdminDto) {
    try {
      const admin_secret_key = process.env.ADMIN_SECRET_KEY;
      const { username, phone, email, password, secret_key } = createAdminDto;
      if (admin_secret_key != secret_key) {
        throw new BadRequestException("Maxsus kalit so'z noto'g'ri!");
      }
      const exist_username = await this.adminRepository.findOne({
        where: { username },
      });
      if (exist_username) {
        throw new BadRequestException("Bunday username ro'yxatdan o'tgan!");
      }
      const exist_email = await this.adminRepository.findOne({
        where: { email },
      });
      if (exist_email) {
        throw new BadRequestException("Bunday email pochta ro'yxatdan o'tgan!");
      }
      const exist_phone = await this.adminRepository.findOne({
        where: { phone },
      });
      if (exist_phone) {
        throw new BadRequestException(
          "Bunday telefon raqam ro'yxatdan o'tgan!",
        );
      }
      const hashed_password = await hash(password, 7);
      const admin = await this.adminRepository.create({
        ...createAdminDto,
        hashed_password,
      });
      return { message: "Admin ro'yxatdan muvaffaqiyatli o'tdi", admin };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginAdminDto: LoginAdminDto) {
    try {
      const { login, password } = loginAdminDto;
      let admin: Admin;
      admin = await this.adminRepository.findOne({
        where: { username: login },
      });
      if (!admin) {
        admin = await this.adminRepository.findOne({
          where: { email: login },
        });
        if (!admin) {
          admin = await this.adminRepository.findOne({
            where: { phone: login },
          });
          if (!admin) {
            throw new BadRequestException('Foydalanuvchi topilmadi!');
          }
        }
      }
      const is_match_pass = await compare(password, admin.hashed_password);
      if (!is_match_pass) {
        throw new UnauthorizedException('Parol mos kelmadi!');
      }
      const { access_token } = await this.generateToken(admin.id);
      return { mesage: 'Tizimga muvaffaqiyatli kirildi', access_token, admin };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const admins = await this.adminRepository.findAll({
        include: { all: true },
      });
      return admins;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!admin) {
        throw new BadRequestException('Admin topilmadi!');
      }
      return admin;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const check = await this.adminRepository.findOne({ where: { id } });
      if (!check) {
        throw new BadRequestException('Admin topilmadi');
      }
      const { username, email, phone } = updateAdminDto;
      if (username) {
        const exist_username = await this.adminRepository.findOne({
          where: { username },
        });
        if (exist_username) {
          if (exist_username.id != id) {
            throw new BadRequestException('Bu username band!');
          }
        }
      }
      if (email) {
        const exist_email = await this.adminRepository.findOne({
          where: { email },
        });
        if (exist_email) {
          if (exist_email.id != id) {
            throw new BadRequestException('Bu email band!');
          }
        }
      }
      if (phone) {
        const exist_phone = await this.adminRepository.findOne({
          where: { phone },
        });
        if (exist_phone) {
          if (exist_phone.id != id) {
            throw new BadRequestException('Bu telefon raqam band!');
          }
        }
      }
      const admin = await this.adminRepository.update(updateAdminDto, {
        where: { id },
        returning: true,
      });
      return {
        message: "Ma'lumotlar muvaffaqiyatli tahrirlandi",
        admin: admin[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async newPassword(id: string, newPasswordAdminDto: NewPasswordAdminDto) {
    try {
      const { old_password, new_password, confirm_new_password } =
        newPasswordAdminDto;
      const admin = await this.adminRepository.findOne({ where: { id } });
      if (!admin) {
        throw new BadRequestException('Admin topilmadi!');
      }
      const is_match_pass = await compare(old_password, admin.hashed_password);
      if (!is_match_pass) {
        throw new UnauthorizedException('Parol mos kelmadi!');
      }
      if (new_password != confirm_new_password) {
        throw new BadRequestException('Yangi parolni tasdiqlashda xatolik!');
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.adminRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        message: 'Parol muvaffaqiyatli yangilandi',
        admin: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async forgotPassword(email: string, code: string) {
    try {
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendSMS() {
    try {
      const axios = require('axios');
      const FormData = require('form-data');
      const data = new FormData();
      data.append('mobile_phone', '998900449101');
      data.append('message', 'florify.uz ga tashrif buyuring\nSalom, qalaysiz');
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

  async remove(id: string) {
    try {
      await this.adminRepository.destroy({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateToken(id: string) {
    try {
      const jwt_payload = {
        id,
        is_admin: true,
      };
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(jwt_payload, {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        }),
        this.jwtService.signAsync(jwt_payload, {
          secret: process.env.REFRESH_TOKEN_KEY,
          expiresIn: process.env.REFRESH_TOKEN_TIME,
        }),
      ]);
      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
