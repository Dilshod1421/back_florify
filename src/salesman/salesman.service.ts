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
      const hashed_password = await hash(salesmanDto.password, 7);
      let salesman: any;
      if (file) {
        const file_name = await this.fileService.createFile(file);
        salesman = await this.salesmanRepository.create({
          ...salesmanDto,
          hashed_password,
          image: file_name,
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
        throw new NotFoundException('Telefon raqam yoki parol xato!');
      }
      const is_match_pass = await compare(password, salesman.hashed_password);
      if (!is_match_pass) {
        throw new ForbiddenException('Login yoki parol xato!');
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
        throw new NotFoundException('Sotuvchi topilmadi!');
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
        throw new NotFoundException('Sotuvchi topilmadi!');
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
            currentPage: Number(page),
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
        throw new NotFoundException('Sotuvchi topilmadi!');
      }
      const is_match_pass = await compare(
        old_password,
        salesman.hashed_password,
      );
      if (!is_match_pass) {
        throw new ForbiddenException('Eski parol mos kelmadi!');
      }
      if (new_password != confirm_new_password) {
        throw new ForbiddenException('Yangi parolni tasdiqlashda xatolik!');
      }
      const hashed_password = await hash(confirm_new_password, 7);
      const updated_info = await this.salesmanRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Parol o'zgartirildi",
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
        throw new ForbiddenException('Yangi parolni tasdiqlashda xatolik!');
      }
      const hashed_password = await hash(new_password, 7);
      const updated_info = await this.salesmanRepository.update(
        { hashed_password },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Parol o'zgartirildi",
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
        throw new NotFoundException('Sotuvchi topilmadi!');
      }
      const { phone, username, address, telegram } = updateDto;
      let dto = {};
      if (!phone) {
        dto = Object.assign(dto, { phone: salesman.phone });
      }
      if (!username) {
        dto = Object.assign(dto, { username: salesman.username });
      }
      if (!address) {
        dto = Object.assign(dto, { address: salesman.address });
      }
      if (!telegram) {
        dto = Object.assign(dto, { telegram: salesman.telegram });
      }
      let obj = {};
      if (!file) {
        dto = Object.assign(dto, { image: salesman.image });
        obj = Object.assign(updateDto, dto);
        const update = await this.salesmanRepository.update(obj, {
          where: { id },
          returning: true,
        });
        return {
          statusCode: HttpStatus.OK,
          message: "Sotuvchi ma'lumotlari tahrirlandi",
          data: {
            salesman: update[1][0],
          },
        };
      }
      if (salesman.image) {
        await this.fileService.deleteFile(salesman.image);
      }
      const file_name = await this.fileService.createFile(file);
      const image_obj = { image: file_name };
      obj = Object.assign(obj, image_obj);
      obj = Object.assign(obj, updateDto);
      const update = await this.salesmanRepository.update(obj, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Sotuvchi ma'lumotlari tahrirlandi",
        data: {
          salesman: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateStore(id: string, storeDto: StoreDto): Promise<object> {
    try {
      const store = await this.salesmanRepository.findByPk(id);
      if (!store) {
        throw new NotFoundException("Do'kon topilmadi!");
      }
      const { store_phone, store_address } = storeDto;
      let dto = {};
      if (!store_phone) {
        dto = Object.assign(dto, { store_phone: store.store_phone });
      }
      if (!store_address) {
        dto = Object.assign(dto, { storeDto: store.store_address });
      }
      let obj = Object.assign(dto, storeDto);
      const update_info = await this.salesmanRepository.update(obj, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Do'kon ma'lumotlari tahrirlandi",
        data: {
          salesman: update_info[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteImage(id: string): Promise<object> {
    try {
      const salesman = await this.salesmanRepository.findByPk(id);
      if (!salesman) {
        throw new NotFoundException('Sotuvchi topilmadi!');
      }
      await this.fileService.deleteFile(salesman.image);
      const update = await this.salesmanRepository.update(
        { image: null },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Sotuvchining rasmi o'chirilid",
        data: {
          salesman: update[1][0],
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
        throw new NotFoundException('Sotuvchi topilmadi!');
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
