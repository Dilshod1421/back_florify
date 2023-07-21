import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './models/category.model';
import { InjectModel } from '@nestjs/sequelize';
import { v4 } from 'uuid';
import { Product } from '../product/models/product.model';
import { Image } from '../image/models/image.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryRepository: typeof Category,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = await this.categoryRepository.create({
        id: v4(),
        ...createCategoryDto,
      });
      return this.getOne(newCategory.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return this.categoryRepository.findAll({
        attributes: ['id', 'name', 'description', 'image_url'],
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

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.getOne(id);
      await this.categoryRepository.update(updateCategoryDto, {
        where: { id },
      });
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.getOne(id);
      await this.categoryRepository.destroy({ where: { id } });
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        attributes: ['id', 'name', 'description', 'image_url'],
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
        ],
      });
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
