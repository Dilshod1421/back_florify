import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { OtpService } from 'src/otp/otp.service';
import { JwtService } from '@nestjs/jwt';
import { generateToken, writeToCookie } from 'src/utils/token';
import { Response } from 'express';
import { UpdateDto } from './dto/update.dto';
import { PhoneDto } from 'src/otp/dto/phone.dto';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';
import { Like } from 'src/like/models/like.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client) private clientRepository: typeof Client,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly fileService: FilesService,
  ) {}

  async register(verifyOtpDto: VerifyOtpDto, res: Response): Promise<object> {
    try {
      await this.otpService.verifyOtp(verifyOtpDto);
      const exist = await this.clientRepository.findOne({
        where: { phone: verifyOtpDto.phone },
      });
      if (exist) {
        const { access_token, refresh_token } = await generateToken(
          { id: exist.id },
          this.jwtService,
        );
        await writeToCookie(refresh_token, res);
        return {
          statusCode: HttpStatus.OK,
          mesage: 'Mijoz tizimga kirdi',
          data: {
            client: exist,
          },
          token: access_token,
        };
      }
      const client = await this.clientRepository.create({
        phone: verifyOtpDto.phone,
      });
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

  async login(phoneDto: PhoneDto): Promise<object> {
    try {
      const client = await this.clientRepository.findOne({
        where: { phone: phoneDto.phone },
      });
      if (!client) {
        throw new NotFoundException('Telefon raqam xato!');
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
        include: { model: Like, attributes: ['is_like', 'product_id'] },
      });
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
        include: { model: Like, attributes: ['is_like', 'product_id'] },
      });
      if (!client) {
        throw new NotFoundException('Mijoz topilmadi!');
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
      const clients = await this.clientRepository.findAll({
        include: { model: Like, attributes: ['is_like', 'product_id'] },
        offset,
        limit,
      });
      const total_count = await this.clientRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: clients,
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

  async updateProfile(
    id: string,
    updateDto: UpdateDto,
    file: any,
  ): Promise<object> {
    try {
      const client = await this.clientRepository.findByPk(id);
      if (!client) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Mijoz topilmadi!');
      }
      const { phone, name, address } = updateDto;
      let dto = {};
      if (!phone) {
        dto = Object.assign(dto, { phone: client.phone });
      }
      if (!name) {
        dto = Object.assign(dto, { name: client.name });
      }
      if (!address) {
        dto = Object.assign(dto, { address: client.address });
      }
      let obj = {};
      if (!file) {
        dto = Object.assign(dto, { image: client.image });
        obj = Object.assign(updateDto, dto);
        const update = await this.clientRepository.update(obj, {
          where: { id },
          returning: true,
        });
        return {
          statusCode: HttpStatus.OK,
          message: "Mijoz ma'lumotlari tahrirlandi",
          data: {
            client: update[1][0],
          },
        };
      }
      if (client.image) {
        await this.fileService.deleteFile(client.image);
      }
      const file_name = await this.fileService.createFile(file);
      const image_obj = { image: file_name };
      obj = Object.assign(obj, updateDto);
      obj = Object.assign(obj, image_obj);
      const update = await this.clientRepository.update(obj, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Mijoz ma'lumotlari tahrirlandi",
        data: {
          category: update[1][0],
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
        throw new NotFoundException('Mijoz topilmadi!');
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
