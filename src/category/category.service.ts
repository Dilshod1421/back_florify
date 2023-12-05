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

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private readonly categoryRepository: typeof Category,
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
      const categories = await this.categoryRepository.findAll({
        include: [
          {
            model: Product,
            include: [{ model: Image, attributes: ['image'] }],
          },
        ],
      });
      if (!categories) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          "Kategoriyalar ro'yxati bo'sh!",
        );
      }
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
            through: {},
            include: [{ model: Image, attributes: ['image'] }],
          },
        ],
      });
      if (!category) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Kategoriya topilmadi!',
        );
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
            include: [{ model: Image, attributes: ['image'] }],
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

  async update(
    id: string,
    categoryDto: CategoryDto,
    file: any,
  ): Promise<object> {
    try {
      const { uz, ru, en, uz_description, ru_description, en_description } =
        categoryDto;
      const category = await this.categoryRepository.findByPk(id);
      if (!category) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Kategoriya topilmadi!',
        );
      }
      if (!file) {
        await this.categoryRepository.update(
          { image: category.image },
          { where: { id }, returning: true },
        );
      }
      if (!uz) {
        await this.categoryRepository.update(
          { uz: category.uz },
          { where: { id }, returning: true },
        );
      }
      if (!ru) {
        await this.categoryRepository.update(
          { ru: category.ru },
          { where: { id }, returning: true },
        );
      }
      if (!en) {
        await this.categoryRepository.update(
          { en: category.en },
          { where: { id }, returning: true },
        );
      }
      if (!uz_description) {
        await this.categoryRepository.update(
          { uz_description: category.uz_description },
          { where: { id }, returning: true },
        );
      }
      if (!ru_description) {
        await this.categoryRepository.update(
          { ru_description: category.ru_description },
          { where: { id }, returning: true },
        );
      }
      if (!en_description) {
        await this.categoryRepository.update(
          { en_description: category.en_description },
          { where: { id }, returning: true },
        );
      }
      await this.fileService.deleteFile(category.image);
      const updated_info = await this.categoryRepository.update(
        { ...categoryDto, image: file },
        {
          where: { id },
          returning: true,
        },
      );
      return {
        statusCode: HttpStatus.OK,
        message: "Kategoriya ma'lumotlari tahrirlandi",
        data: {
          category: updated_info[1][0],
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
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Kategoriya topilmadi!',
        );
      }
      category.destroy();
      await this.fileService.deleteFile(category.image);
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Kategoriya ro'yxatdan o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
