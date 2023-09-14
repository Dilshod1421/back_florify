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
import { generate } from 'otp-generator';
import { sendOTP } from 'src/utils/sendOtp';
import { Response } from 'express';
import { generateToken, writeToCookie } from 'src/utils/token';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { Otp } from './models/otp.model';
import { PhoneDto } from './dto/phone.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private adminRepository: typeof Admin,
    @InjectModel(Otp) private otpRepository: typeof Otp,
    private readonly jwtService: JwtService,
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

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const phone = await this.otpRepository.findOne({
        where: { phone: verifyOtpDto.phone },
      });
      if (!phone) {
        throw new BadRequestException('Telefon raqami xato kiritldi!');
      }
      const now = Date.now();
      if (now > phone.expire_time) {
        phone.destroy();
        throw new BadRequestException(
          'Sizga yuborilgan parol vaqti tugadi, iltimos telefon raqamini qaytadan kiriting!',
        );
      }
      if (verifyOtpDto.code != phone.code) {
        throw new BadRequestException('Parolni tasdiqlashda xatolik!');
      }
      phone.destroy();
      return { message: 'Parol tasdiqlandi' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(createAdminDto: CreateAdminDto) {
    try {
      const { username, phone, email, password, secret_key } = createAdminDto;
      if (process.env.ADMIN_SECRET_KEY != secret_key) {
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
      return { message: "Admin ro'yxatdan o'tdi", admin };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginAdminDto: LoginAdminDto, res: Response) {
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
      const jwt_payload = { id: admin.id };
      const { access_token, refresh_token } = await generateToken(
        jwt_payload,
        this.jwtService,
      );
      const hashed_refresh_token = await hash(refresh_token, 7);
      await this.adminRepository.update(
        { hashed_refresh_token },
        { where: { id: admin.id }, returning: true },
      );
      await writeToCookie(refresh_token, res);
      return {
        mesage: 'Admin tizimga kirdi',
        access_token,
        admin,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logout(refresh_token: string, res: Response) {
    try {
      const data = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      if (!data) {
        throw new UnauthorizedException('Tizimdan chiqishda xatolik!');
      }
      const check = await this.findById(data.id);
      const is_match = await compare(refresh_token, check.hashed_refresh_token);
      if (!is_match) {
        throw new BadRequestException('Tizimdan chiqishda xatololik!');
      }
      const admin = await this.adminRepository.update(
        { hashed_refresh_token: null },
        { where: { id: data.id }, returning: true },
      );
      res.clearCookie('refresh_token');
      return { mesage: 'Admin tizimdan chiqdi', admin: admin[1][0] };
    } catch (error) {}
  }

  async paginate(page: number) {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const admins = await this.adminRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.adminRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: admins,
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

  async newPassword(id: string, newPasswordDto: NewPasswordDto) {
    try {
      const { old_password, new_password, confirm_new_password } =
        newPasswordDto;
      const admin = await this.findById(id);
      const is_match_pass = await compare(old_password, admin.hashed_password);
      if (!is_match_pass) {
        throw new UnauthorizedException('Eski parol mos kelmadi!');
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

  async forgotPassword(id: string, forgotPasswordDto: ForgotPasswordDto) {
    try {
      await this.findById(id);
      const { new_password, confirm_new_password } = forgotPasswordDto;
      if (new_password != confirm_new_password) {
        throw new BadRequestException('Parolni tasdiqlashda xatolik!');
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

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const check = await this.findById(id);
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

  async remove(id: string) {
    try {
      const admin = await this.findById(id);
      admin.destroy();
      return { message: "Admin ro'yxatdan o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
