import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './models/category.model';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryDto } from './dto/category.dto';
import { Product } from 'src/product/models/product.model';
import { Image } from 'src/image/models/image.model';
import { FilesService } from 'src/files/files.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
    private readonly fileService: FilesService,
  ) {}

  async create(categoryDto: CategoryDto, file: any): Promise<object> {
    try {
      const file_name = await this.fileService.createFile(file);
      const category = await this.categoryRepository.create({
        ...categoryDto,
        image: file_name,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: "Kategoriya ro'yxatga qo'shildi",
        data: {
          category,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const categories = await this.categoryRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: {
          categories,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const category = await this.categoryRepository.findByPk(id, {
        include: [
          {
            model: Product,
            include: [Image],
          },
        ],
      });
      if (!category) {
        throw new NotFoundException('Kategoriya topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          category,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const categories = await this.categoryRepository.findAll({
        include: [
          {
            model: Product,
            include: [Image],
          },
        ],
        offset,
        limit,
      });
      const total_count = await this.categoryRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: categories,
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

  async update(
    id: string,
    updateDto: UpdateCategoryDto,
    file: any,
  ): Promise<object> {
    try {
      const category = await this.categoryRepository.findByPk(id);
      if (!category) {
        throw new NotFoundException('Kategoriya topilmadi!');
      }
      const { uz, ru, uz_description, ru_description } = updateDto;
      let dto = {};
      if (!uz) {
        dto = Object.assign(dto, { uz: category.uz });
      }
      if (!ru) {
        dto = Object.assign(dto, { ru: category.ru });
      }
      if (!uz_description) {
        dto = Object.assign(dto, { uz_description: category.uz_description });
      }
      if (!ru_description) {
        dto = Object.assign(dto, { ru_description: category.ru_description });
      }
      let obj = {};
      if (!file) {
        dto = Object.assign(dto, { image: category.image });
        obj = Object.assign(updateDto, dto);
        const update = await this.categoryRepository.update(obj, {
          where: { id },
          returning: true,
        });
        return {
          statusCode: HttpStatus.OK,
          message: "Kategoriya ma'lumotlari tahrirlandi",
          data: {
            category: update[1][0],
          },
        };
      }
      await this.fileService.deleteFile(category.image);
      const file_name = await this.fileService.createFile(file);
      const image_obj = { image: file_name };
      obj = Object.assign(obj, updateDto);
      obj = Object.assign(obj, image_obj);
      const update = await this.categoryRepository.update(obj, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Kategoriya ma'lumotlari tahrirlandi",
        data: {
          category: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<object> {
    try {
      const category = await this.categoryRepository.findByPk(id);
      if (!category) {
        throw new NotFoundException('Kategoriya topilmadi!');
      }
      await this.fileService.deleteFile(category.image);
      category.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Kategoriya ro'yxatdan o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
