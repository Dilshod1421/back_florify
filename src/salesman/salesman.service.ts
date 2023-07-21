import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSalesmanDto } from './dto/create-salesman.dto';
import { UpdateSalesmanDto } from './dto/update-salesman.dto';
import { Salesman } from './models/salesman.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { LoginSalesmanDto } from './dto/login-salesman.dto';
import { compare, hash } from 'bcryptjs';
import { v4 } from 'uuid';
import { SocialNetwork } from '../social-network/models/social-network.model';
import { Product } from '../product/models/product.model';
import { Category } from '../category/models/category.model';
import { Image } from '../image/models/image.model';
import { SoldProduct } from '../sold-product/models/sold-product.model';

@Injectable()
export class SalesmanService {
  constructor(
    @InjectModel(Salesman)
    private readonly salesmanRepository: typeof Salesman,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginSalesmanDto: LoginSalesmanDto) {
    try {
      const { phone, password } = loginSalesmanDto;
      const salesmanByPhone = await this.getSalesmanByPhone(phone);
      if (!salesmanByPhone) {
        throw new UnauthorizedException('Phone or password is wrong');
      }
      const isMatchPass = await compare(
        password,
        salesmanByPhone.hashed_password,
      );
      if (!isMatchPass) {
        throw new UnauthorizedException('Phone or password is wrong');
      }
      const { access_token } = await this.getToken(salesmanByPhone);
      const salesman = await this.getOne(salesmanByPhone.id);
      const response = {
        token: access_token,
        salesman,
      };
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createSalesmanDto: CreateSalesmanDto) {
    try {
      const salesmanByEmail = await this.getSalesmanByEmail(
        createSalesmanDto.email,
      );
      if (salesmanByEmail) {
        throw new BadRequestException('Email already registered!');
      }
      const salesmanByPhone = await this.getSalesmanByPhone(
        createSalesmanDto.phone,
      );
      if (salesmanByPhone) {
        throw new BadRequestException('Phone already registered!');
      }
      const hashed_password = await hash(createSalesmanDto.password, 7);
      const newSalesman = await this.salesmanRepository.create({
        id: v4(),
        ...createSalesmanDto,
        hashed_password,
      });
      return this.getOne(newSalesman.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return this.salesmanRepository.findAll({
        attributes: [
          'id',
          'full_name',
          'brand',
          'address',
          'image_url',
          'email',
          'phone',
        ],
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateSalesmanDto: UpdateSalesmanDto) {
    try {
      const salesman = await this.getOne(id);
      if (updateSalesmanDto.email) {
        const salesmanByEmail = await this.getSalesmanByEmail(
          updateSalesmanDto.email,
        );
        if (salesmanByEmail && salesmanByEmail.id != id) {
          throw new BadRequestException('Email already registered!');
        }
      }
      if (updateSalesmanDto.phone) {
        const salesmanByPhone = await this.getSalesmanByPhone(
          updateSalesmanDto.phone,
        );
        if (salesmanByPhone && salesmanByPhone.id != id) {
          throw new BadRequestException('Phone already registered!');
        }
      }
      if (updateSalesmanDto.password) {
        const hashed_password = await hash(updateSalesmanDto.password, 7);
        await this.salesmanRepository.update(
          { hashed_password },
          { where: { id } },
        );
      }
      await this.salesmanRepository.update(updateSalesmanDto, {
        where: { id },
      });
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const salesman = await this.getOne(id);
      await this.salesmanRepository.destroy({ where: { id } });
      return salesman;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const salesman = await this.salesmanRepository.findOne({
        where: { id },
        attributes: [
          'id',
          'full_name',
          'brand',
          'address',
          'image_url',
          'email',
          'phone',
        ],
        include: [
          {
            model: SocialNetwork,
            attributes: ['id', 'name', 'link'],
          },
          {
            model: Product,
            attributes: [
              'id',
              'name',
              'description',
              'price',
              'color',
              'createdAt',
            ],
            include: [
              {
                model: Category,
                attributes: ['id', 'name', 'description', 'image_url'],
              },
              {
                model: Image,
                attributes: ['id', 'image_url'],
              },
            ],
          },
        ],
      });
      if (!salesman) {
        throw new HttpException('Salesman not found', HttpStatus.NOT_FOUND);
      }
      return salesman;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSalesmanByEmail(email: string) {
    try {
      const salesman = await this.salesmanRepository.findOne({
        where: { email },
        attributes: [
          'id',
          'full_name',
          'brand',
          'address',
          'image_url',
          'email',
          'phone',
          'hashed_password',
        ],
      });
      return salesman;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSalesmanByPhone(phone: string) {
    try {
      const Salesman = await this.salesmanRepository.findOne({
        where: { phone },
        attributes: [
          'id',
          'full_name',
          'brand',
          'address',
          'image_url',
          'email',
          'phone',
          'hashed_password',
        ],
      });
      return Salesman;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getToken(Salesman: Salesman) {
    try {
      const jwtPayload = {
        id: Salesman.id,
        email: Salesman.email,
        phone: Salesman.phone,
      };
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        }),
        this.jwtService.signAsync(jwtPayload, {
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
