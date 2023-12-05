import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';

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
      await this.otpService.checkPhoneNumber(registerAdminDto.phone);
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
        data: {
          admin,
        },
        token: access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginAdminDto: LoginAdminDto): Promise<object> {
    try {
      const { phone, password } = loginAdminDto;
      const admin = await this.adminRepository.findOne({ where: { phone } });
      if (!admin) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Telefon raqam yoki parol xato!',
        );
      }
      const is_match_pass = await compare(password, admin.hashed_password);
      if (!is_match_pass) {
        throw new ForbiddenException(
          HttpStatus.FORBIDDEN,
          'Login yoki parol xato!',
        );
      }
      return this.otpService.sendOTP({ phone });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyLogin(
    verifyOtpDto: VerifyOtpDto,
    res: Response,
  ): Promise<object> {
    try {
      await this.otpService.verifyOtp(verifyOtpDto);
      const admin = await this.adminRepository.findOne({
        where: { phone: verifyOtpDto.phone },
      });
      if (!admin) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Admin topilmadi!');
      }
      const { access_token, refresh_token } = await generateToken(
        { id: admin.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Admin tizimga kirdi',
        data: {
          admin,
        },
        token: access_token,
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
      const admin = await this.getById(data.id);
      res.clearCookie('refresh_token');
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Admin tizimdan chiqdi',
        data: {
          admin,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const admins = await this.adminRepository.findAll();
      if (!admins) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          "Adminlar ro'yxati bo'sh!",
        );
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          admins,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const admin = await this.adminRepository.findByPk(id);
      if (!admin) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Admin topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          admin,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const admins = await this.adminRepository.findAll({ offset, limit });
      const total_count = await this.adminRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: admins,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return response;
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
      const admin = await this.adminRepository.findByPk(id);
      if (!admin) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Admin topilmadi!');
      }
      const is_match_pass = await compare(old_password, admin.hashed_password);
      if (!is_match_pass) {
        throw new ForbiddenException(
          HttpStatus.FORBIDDEN,
          'Eski parol mos kelmadi!',
        );
      }
      if (new_password != confirm_new_password) {
        throw new ForbiddenException(
          HttpStatus.FORBIDDEN,
          'Yangi parolni tasdiqlashda xatolik!',
        );
      }
      const hashed_password = await hash(confirm_new_password, 7);
      const updated_info = await this.adminRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Parol o'zgartirildi",
        data: {
          admin: updated_info[1][0],
        },
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
      const { phone, code, new_password, confirm_new_password } =
        forgotPasswordDto;
      await this.otpService.verifyOtp({ phone, code });
      await this.getById(id);
      if (new_password != confirm_new_password) {
        throw new ForbiddenException(
          HttpStatus.FORBIDDEN,
          'Yangi parolni tasdiqlashda xatolik!',
        );
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.adminRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Paroli o'zgartirildi",
        data: {
          admin: updated_info[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateProfile(
    id: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<object> {
    try {
      const admin = await this.adminRepository.findByPk(id);
      if (!admin) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Admin topilmadi!');
      }
      const { email, phone, username } = updateAdminDto;
      if (!phone) {
        await this.adminRepository.update(
          { phone: admin.phone },
          { where: { id }, returning: true },
        );
      }
      if (!email) {
        await this.adminRepository.update(
          { email: admin.email },
          { where: { id }, returning: true },
        );
      }
      if (!username) {
        await this.adminRepository.update(
          { username: admin.username },
          { where: { id }, returning: true },
        );
      }
      const profile = await this.adminRepository.update(updateAdminDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Adminning ma'lumotlari tahrirlandi",
        data: {
          admin: profile[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteAdmin(id: string): Promise<object> {
    try {
      const admin = await this.adminRepository.findByPk(id);
      if (!admin) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Admin topilmadi!');
      }
      admin.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Admin ro'yxatdan o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
