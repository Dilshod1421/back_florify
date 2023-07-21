import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { v4 } from 'uuid';
import { Cart } from '../cart/models/cart.model';
import { SoldProduct } from '../sold-product/models/sold-product.model';
import { Product } from '../product/models/product.model';
import { Category } from '../category/models/category.model';
import { Salesman } from '../salesman/models/salesman.model';
import { Image } from '../image/models/image.model';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client)
    private readonly clientRepository: typeof Client,
  ) {}

  async create(createClientDto: CreateClientDto) {
    try {
      const clientByPhone = await this.getClientByPhone(createClientDto.phone);
      if (clientByPhone) {
        throw new BadRequestException('Phone already registered!');
      }
      const newClient = await this.clientRepository.create({
        id: v4(),
        ...createClientDto,
      });
      return this.getOne(newClient.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return this.clientRepository.findAll({
        attributes: ['id', 'full_name', 'address', 'phone'],
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

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const client = await this.getOne(id);
      if (updateClientDto.phone) {
        const clientByPhone = await this.getClientByPhone(
          updateClientDto.phone,
        );
        if (clientByPhone && clientByPhone.id != id) {
          throw new BadRequestException('Phone already registered!');
        }
      }
      await this.clientRepository.update(updateClientDto, {
        where: { id },
      });
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const client = await this.getOne(id);
      await this.clientRepository.destroy({ where: { id } });
      return client;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const client = await this.clientRepository.findOne({
        where: { id },
        attributes: ['id', 'full_name', 'address', 'phone'],
        include: [
          {
            model: Cart,
            attributes: ['id'],
            include: [
              {
                model: SoldProduct,
                attributes: ['id'],
                include: [
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
                  {
                    model: Salesman,
                    attributes: [
                      'id',
                      'full_name',
                      'brand',
                      'address',
                      'image_url',
                      'email',
                      'phone',
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      if (!client) {
        throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
      }
      return client;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getClientByPhone(phone: string) {
    try {
      const client = await this.clientRepository.findOne({
        where: { phone },
        attributes: ['id', 'full_name', 'address', 'phone'],
      });
      return client;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
