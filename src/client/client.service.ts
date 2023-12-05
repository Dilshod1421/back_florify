import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { OtpService } from 'src/otp/otp.service';
import { SignupClientDto } from './dto/singup-client.dto';
import { JwtService } from '@nestjs/jwt';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Response } from 'express';
import { UpdateDto } from './dto/update.dto';
import { PhoneDto } from 'src/otp/dto/phone.dto';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client)
    private readonly clientRepository: typeof Client,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  async register(signupDto: SignupClientDto, res: Response): Promise<object> {
    try {
      const { phone, code } = signupDto;
      await this.otpService.verifyOtp({ phone, code });
      const client = await this.clientRepository.create(signupDto);
      const { access_token, refresh_token } = await generateToken(
        { id: client.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.CREATED,
        message: "Mijoz ro'yxatga olindi",
        data: {
          client,
        },
        token: access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(phoneDto: PhoneDto) {
    try {
      const client = await this.clientRepository.findOne({
        where: { phone: phoneDto.phone },
      });
      if (!client) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Telefon raqam xato!',
        );
      }
      return this.otpService.sendOTP({ phone: phoneDto.phone });
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
      const client = await this.clientRepository.findOne({
        where: { phone: verifyOtpDto.phone },
      });
      const { access_token, refresh_token } = await generateToken(
        { id: client.id },
        this.jwtService,
      );
      await writeToCookie(refresh_token, res);
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Mijoz tizimga kirdi',
        data: {
          client,
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
      const client = await this.getById(data.id);
      res.clearCookie('refresh_token');
      return {
        statusCode: HttpStatus.OK,
        mesage: 'Mijoz tizimdan chiqdi',
        data: {
          client,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const clients = await this.clientRepository.findAll({
        include: { all: true },
      });
      if (!clients) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          "Mijozlar ro'yxati bo'sh!",
        );
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          clients,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const client = await this.clientRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!client) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Mijoz topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          client,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const clients = await this.clientRepository.findAll({ offset, limit });
      const total_count = await this.clientRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: clients,
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

  async updateProfile(id: string, updateDto: UpdateDto): Promise<object> {
    try {
      const client = await this.clientRepository.findByPk(id);
      if (!client) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Mijoz topilmadi!');
      }
      const { phone, name, address } = updateDto;
      if (!phone) {
        await this.clientRepository.update(
          { phone: client.phone },
          { where: { id }, returning: true },
        );
      }
      if (!name) {
        await this.clientRepository.update(
          { name: client.name },
          { where: { id }, returning: true },
        );
      }
      if (!address) {
        await this.clientRepository.update(
          { address: client.address },
          { where: { id }, returning: true },
        );
      }
      const profile = await this.clientRepository.update(updateDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Mijoz ma'lumotlari tahrirlandi",
        data: {
          client: profile[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteClient(id: string): Promise<object> {
    try {
      const client = await this.clientRepository.findByPk(id);
      if (!client) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Mijoz topilmadi!');
      }
      client.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Mijoz ro'yxatdan o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
