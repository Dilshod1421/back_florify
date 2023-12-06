import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Response } from 'express';
import { generateToken, writeToCookie } from 'src/utils/token';
import { OtpService } from 'src/otp/otp.service';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';
import { Salesman } from './models/salesman.model';
import { SalesmanDto } from './dto/salesman.dto';
import { LoginSalesmanDto } from './dto/login-salesman.dto';
import { Product } from 'src/product/models/product.model';
import { Image } from 'src/image/models/image.model';
import { NewPasswordDto } from 'src/admin/dto/new-password.dto';
import { ForgotPasswordDto } from 'src/admin/dto/forgot-password.dto';
import { FilesService } from 'src/files/files.service';
import { UpdateSalesmanDto } from './dto/update-salesman.dto';
import { StoreDto } from './dto/store.dto';

@Injectable()
export class SalesmanService {
  constructor(
    @InjectModel(Salesman) private salesmanRepository: typeof Salesman,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly fileService: FilesService,
  ) {}

  async register(
    salesmanDto: SalesmanDto,
    res: Response,
    file: any,
  ): Promise<object> {
    try {
      await this.otpService.checkPhoneNumber(salesmanDto.phone);
      const hashed_password = await hash(salesmanDto.password, 7);
      let salesman: any;
      if (file) {
        const image_name = await this.fileService.createFile(file);
        salesman = await this.salesmanRepository.create({
          ...salesmanDto,
          hashed_password,
          image: image_name,
        });
      } else if (!file) {
        salesman = await this.salesmanRepository.create({
          ...salesmanDto,
          hashed_password,
        });
      }
      const { access_token, refresh_token } = await generateToken(
        { id: salesman.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.CREATED,
        message: "Sotuvchi ro'yxatdan o'tdi",
        data: {
          salesman,
        },
        token: access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginSalesmanDto): Promise<object> {
    try {
      const { phone, password } = loginDto;
      const salesman = await this.salesmanRepository.findOne({
        where: { phone },
      });
      if (!salesman) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Telefon raqam yoki parol xato!',
        );
      }
      const is_match_pass = await compare(password, salesman.hashed_password);
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
      const salesman = await this.salesmanRepository.findOne({
        where: { phone: verifyOtpDto.phone },
      });
      if (!salesman) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Sotuvchi topilmadi!',
        );
      }
      const { access_token, refresh_token } = await generateToken(
        { id: salesman.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Sotuvchi tizimga kirdi',
        data: {
          salesman,
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
      const salesman = await this.getById(data.id);
      res.clearCookie('refresh_token');
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Sotuvchi tizimdan chiqdi',
        data: {
          salesman,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const salesmans = await this.salesmanRepository.findAll({
        include: [
          {
            model: Product,
            include: [{ model: Image, attributes: ['image'] }],
          },
        ],
      });
      if (!salesmans) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          "Adminlar ro'yxati bo'sh!",
        );
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          salesmans,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const salesman = await this.salesmanRepository.findByPk(id, {
        include: [
          {
            model: Product,
            include: [{ model: Image, attributes: ['image'] }],
          },
        ],
      });
      if (!salesman) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Sotuvchi topilmadi!',
        );
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          salesman,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const salesmans = await this.salesmanRepository.findAll({
        include: [
          {
            model: Product,
            include: [{ model: Image, attributes: ['image'] }],
          },
        ],
        offset,
        limit,
      });
      const total_count = await this.salesmanRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: salesmans,
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
      const salesman = await this.salesmanRepository.findByPk(id);
      if (!salesman) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Sotuvchi topilmadi!',
        );
      }
      const is_match_pass = await compare(
        old_password,
        salesman.hashed_password,
      );
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
      const updated_info = await this.salesmanRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Paroli o'zgartirildi",
        data: {
          salesman: updated_info[1][0],
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
      const updated_info = await this.salesmanRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Paroli o'zgartirildi",
        data: {
          salesman: updated_info[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateProfile(
    id: string,
    updateDto: UpdateSalesmanDto,
    file: any,
  ): Promise<object> {
    try {
      const salesman = await this.salesmanRepository.findByPk(id);
      if (!salesman) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Sotuvchi topilmadi!',
        );
      }
      const { phone, username, address, telegram } = updateDto;
      if (!phone) {
        await this.salesmanRepository.update(
          { phone: salesman.phone },
          { where: { id }, returning: true },
        );
      }
      if (!username) {
        await this.salesmanRepository.update(
          { username: salesman.username },
          { where: { id }, returning: true },
        );
      }
      if (!address) {
        await this.salesmanRepository.update(
          { address: salesman.address },
          { where: { id }, returning: true },
        );
      }
      if (!telegram) {
        await this.salesmanRepository.update(
          { telegram: salesman.telegram },
          { where: { id }, returning: true },
        );
      }
      if (!file) {
        const profile = await this.salesmanRepository.update(
          { image: salesman.image, ...updateDto },
          { where: { id }, returning: true },
        );
        return {
          statusCode: HttpStatus.OK,
          message: "Sotuvchining ma'lumotlari tahrirlandi",
          data: {
            salesman: profile[1][0],
          },
        };
      }
      if (file) {
        const file_name = await this.fileService.createFile(file);
        const profile = await this.salesmanRepository.update(
          { ...updateDto, image: file_name },
          {
            where: { id },
            returning: true,
          },
        );
        await this.fileService.deleteFile(salesman.image);
        return {
          statusCode: HttpStatus.OK,
          message: "Sotuvchining ma'lumotlari tahrirlandi",
          data: {
            salesman: profile[1][0],
          },
        };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateStore(id: string, storeDto: StoreDto): Promise<object> {
    try {
      const store = await this.salesmanRepository.findByPk(id);
      if (!store) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, "Do'kon topilmadi!");
      }
      if (!storeDto.store_address) {
        await this.salesmanRepository.update(
          { store_address: storeDto.store_address },
          { where: { id }, returning: true },
        );
      }
      if (!storeDto.store_phone) {
        await this.salesmanRepository.update(
          { store_phone: storeDto.store_phone },
          { where: { id }, returning: true },
        );
      }
      const update = await this.salesmanRepository.update(storeDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Do'kon ma'lumotlari tahrirlandi",
        data: {
          store: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<object> {
    try {
      const salesman = await this.salesmanRepository.findByPk(id);
      if (!salesman) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Sotuvchi topilmadi!',
        );
      }
      await this.fileService.deleteFile(salesman.image);
      salesman.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Sotuvchi ro'yxatdan o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
