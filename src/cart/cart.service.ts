import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './models/cart.model';
import { ClientService } from './../client/client.service';
import { v4 } from 'uuid';
import { Category } from '../category/models/category.model';
import { Image } from '../image/models/image.model';
import { Salesman } from '../salesman/models/salesman.model';
import { SoldProduct } from '../sold-product/models/sold-product.model';
import { Product } from '../product/models/product.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private readonly cartRepository: typeof Cart,
    private readonly clientService: ClientService,
  ) {}

  async create(createCartDto: CreateCartDto) {
    try {
      await this.clientService.getOne(createCartDto.client_id);
      const newCart = await this.cartRepository.create({
        id: v4(),
        ...createCartDto,
      });
      return this.getOne(newCart.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return this.cartRepository.findAll({
        attributes: ['id', 'client_id'],
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

  async update(id: string, updateCartDto: UpdateCartDto) {
    try {
      const cart = await this.getOne(id);
      await this.cartRepository.update(updateCartDto, {
        where: { id },
      });
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const cart = await this.getOne(id);
      await this.cartRepository.destroy({ where: { id } });
      return cart;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { id },
        attributes: ['id', 'client_id'],
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
      });
      if (!cart) {
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
      }
      return cart;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
