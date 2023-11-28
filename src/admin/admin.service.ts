import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './models/admin.models';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { generateToken, writeToCookie } from 'src/utils/token';
import { NewPasswordDto } from './dto/new-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { OtpService } from 'src/otp/otp.service';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private adminRepository: typeof Admin,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerAdminDto: RegisterAdminDto,
    res: Response,
  ): Promise<object> {
    try {
      if (process.env.ADMIN_SECRET_KEY != registerAdminDto.secret_key) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: "Maxsus kalit so'z noto'g'ri!",
        };
      }
      const hashed_password = await hash(registerAdminDto.password, 7);
      const admin = await this.adminRepository.create({
        ...registerAdminDto,
        hashed_password,
      });
      const { access_token, refresh_token } = await generateToken(
        { id: admin.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.CREATED,
        message: "Admin ro'yxatdan o'tdi",
        token: access_token,
        admin,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginAdminDto: LoginAdminDto, res: Response): Promise<object> {
    try {
      const { login, password } = loginAdminDto;
      let admin: Admin;
      admin = await this.getByEmail(login);
      if (!admin) {
        admin = await this.getByPhone(login);
        if (!admin) {
          admin = await this.getByUsername(login);
          if (!admin) {
            return {
              statusCode: HttpStatus.NOT_FOUND,
              message: 'Login yoki parol xato!',
            };
          }
        }
      }
      const is_match_pass = await compare(password, admin.hashed_password);
      if (!is_match_pass) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Login yoki parol xato!',
        };
      }
      const { access_token, refresh_token } = await generateToken(
        { id: admin.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Admin tizimga kirdi',
        access_token,
        admin,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async logout(refresh_token: string, res: Response): Promise<object> {
    try {
      const data = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      await this.getById(data.id);
      res.clearCookie('refresh_token');
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Admin tizimdan chiqdi',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<Admin[]> {
    try {
      const admins = await this.adminRepository.findAll();
      return admins;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page_limit: string): Promise<object> {
    try {
      const page = Number(page_limit.split('_')[0]);
      const limit = Number(page_limit.split('_')[1]);
      const offset = (page - 1) * limit;
      const admins = await this.adminRepository.findAll({ offset, limit });
      const total_count = await this.adminRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      return {
        admins,
        pagination: {
          currentPage: page,
          total_pages,
          total_count,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<Admin> {
    try {
      const admin = await this.adminRepository.findByPk(id);
      if (!admin) {
        throw new BadRequestException(HttpStatus.NOT_FOUND, 'Admin topilmadi!');
      }
      return admin;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByEmail(email: string): Promise<Admin> {
    try {
      const admin = await this.adminRepository.findOne({ where: { email } });
      return admin;
    } catch (error) {
      throw new BadRequestException(error.mesage);
    }
  }

  async getByPhone(phone: string): Promise<Admin> {
    try {
      const admin = await this.adminRepository.findOne({ where: { phone } });
      return admin;
    } catch (error) {
      throw new BadRequestException(error.mesage);
    }
  }

  async getByUsername(username: string): Promise<Admin> {
    try {
      const admin = await this.adminRepository.findOne({ where: { username } });
      return admin;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async newPassword(
    id: string,
    newPasswordDto: NewPasswordDto,
  ): Promise<object> {
    try {
      const { old_password, new_password, confirm_new_password } =
        newPasswordDto;
      const admin = await this.getById(id);
      const is_match_pass = await compare(old_password, admin.hashed_password);
      if (!is_match_pass) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Eski parol mos kelmadi!',
        };
      }
      if (new_password != confirm_new_password) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Yangi parolni tasdiqlashda xatolik!',
        };
      }
      const hashed_password = await hash(confirm_new_password, 7);
      const updated_info = await this.adminRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Adminning paroli yangilandi',
        admin: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async forgotPassword(
    id: string,
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<object> {
    try {
      await this.getById(id);
      const { new_password, confirm_new_password } = forgotPasswordDto;
      if (new_password != confirm_new_password) {
        throw new BadRequestException('Yangi parolni tasdiqlashda xatolik!');
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.adminRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Adminning paroli yangilandi',
        admin: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const admin = await this.getById(id);
      const { email, phone, username } = updateAdminDto;
      if (!email) {
        await this.adminRepository.update(
          { email: admin.email },
          { where: { id }, returning: true },
        );
      }
      if (!phone) {
        await this.adminRepository.update(
          { phone: admin.phone },
          { where: { id }, returning: true },
        );
      }
      if (!username) {
        await this.adminRepository.update(
          { username: admin.username },
          { where: { id }, returning: true },
        );
      }
      const updated_info = await this.adminRepository.update(updateAdminDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Adminning ma'lumotlari tahrirlandi",
        admin: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const admin = await this.getById(id);
      admin.destroy();
      return { message: "Admin ro'yxatdan o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
