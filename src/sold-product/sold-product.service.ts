import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateSoldProductDto } from './dto/create-sold-product.dto';
import { UpdateSoldProductDto } from './dto/update-sold-product.dto';
import { SoldProduct } from './models/sold-product.model';
import { InjectModel } from '@nestjs/sequelize';
import { ProductService } from '../product/product.service';
import { CartService } from './../cart/cart.service';
import { SalesmanService } from './../salesman/salesman.service';
import { v4 } from 'uuid';
import { Product } from '../product/models/product.model';
import { Category } from '../category/models/category.model';
import { Image } from '../image/models/image.model';
import { Salesman } from '../salesman/models/salesman.model';

@Injectable()
export class SoldProductService {
  constructor(
    @InjectModel(SoldProduct)
    private readonly SoldProductRepository: typeof SoldProduct,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly salesmanService: SalesmanService,
  ) {}

  async create(createSoldProductDto: CreateSoldProductDto) {
    try {
      await this.productService.getOne(createSoldProductDto.product_id);
      await this.cartService.getOne(createSoldProductDto.cart_id);
      await this.salesmanService.getOne(createSoldProductDto.salesman_id);
      const newSoldProduct = await this.SoldProductRepository.create({
        id: v4(),
        ...createSoldProductDto,
      });
      return this.getOne(newSoldProduct.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return this.SoldProductRepository.findAll({
        attributes: ['id', 'product_id', 'cart_id', 'salesman_id'],
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

  async update(id: string, updateSoldProductDto: UpdateSoldProductDto) {
    try {
      const soldProduct = await this.getOne(id);
      await this.SoldProductRepository.update(updateSoldProductDto, {
        where: { id },
      });
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const soldProduct = await this.getOne(id);
      await this.SoldProductRepository.destroy({ where: { id } });
      return soldProduct;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const soldProduct = await this.SoldProductRepository.findOne({
        where: { id },
        attributes: ['id', 'cart_id'],
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
      });
      if (!soldProduct) {
        throw new HttpException('Sold Product not found', HttpStatus.NOT_FOUND);
      }
      return soldProduct;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
