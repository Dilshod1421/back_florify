import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { SalesmanService } from '../salesman/salesman.service';
import { CategoryService } from './../category/category.service';
import { v4 } from 'uuid';
import { Category } from '../category/models/category.model';
import { Image } from '../image/models/image.model';
import { Salesman } from '../salesman/models/salesman.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product,
    private readonly categoryService: CategoryService,
    private readonly salesmanService: SalesmanService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      await this.categoryService.getOne(createProductDto.category_id);
      await this.salesmanService.findById(createProductDto.salesman_id);
      const newProduct = await this.productRepository.create({
        id: v4(),
        ...createProductDto,
      });
      return this.getOne(newProduct.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return this.productRepository.findAll({
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.getOne(id);
      if (updateProductDto.category_id)
        await this.categoryService.getOne(updateProductDto.category_id);
      await this.productRepository.update(updateProductDto, {
        where: { id },
      });
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.getOne(id);
      await this.productRepository.destroy({ where: { id } });
      return product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
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
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
