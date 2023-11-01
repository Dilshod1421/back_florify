import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from './models/category.model';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryDto } from './dto/category.dto';
import { Product } from 'src/product/models/product.model';
import { Image } from 'src/image/models/image.model';
import { FilesService } from 'src/files/files.service';
import { Like } from 'src/like/models/like.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private readonly categoryRepository: typeof Category,
    private readonly fileService: FilesService,
  ) {}

  async create(categoryDto: CategoryDto, file: any) {
    try {
      const file_name = await this.fileService.createFile(file);
      const category = await this.categoryRepository.create({
        ...categoryDto,
        image: file_name,
      });
      return { message: "Kategoriya ro'yxatga qo'shildi", category };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepository.findAll({
        include: [
          {
            model: Product,
            include: [
              { model: Image, attributes: ['image'] },
              { model: Like, attributes: ['is_like'] },
            ],
          },
        ],
      });
      return categories;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const categories = await this.categoryRepository.findAll({
        include: [
          {
            model: Product,
            include: [
              { model: Image, attributes: ['image'] },
              { model: Like, attributes: ['is_like'] },
            ],
          },
        ],
        offset,
        limit,
      });
      const total_count = await this.categoryRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: categories,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return res;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        include: [
          {
            model: Product,
            include: [
              { model: Image, attributes: ['image'] },
              { model: Like, attributes: ['is_like'] },
            ],
          },
        ],
      });
      if (!category) {
        throw new BadRequestException('Kategoriya topilmadi!');
      }
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, categoryDto: CategoryDto, file: any) {
    try {
      await this.findById(id);
      if (file) {
        const file_name = await this.fileService.createFile(file);
        const updated_info = await this.categoryRepository.update(
          { ...categoryDto, image: file_name },
          { where: { id }, returning: true },
        );
        return {
          message: "Ma'lumotlar tahrirlandi",
          category: updated_info[1][0],
        };
      }
      const updated_info = await this.categoryRepository.update(categoryDto, {
        where: { id },
        returning: true,
      });
      return {
        message: "Ma'lumotlar tahrirlandi",
        category: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.findById(id);
      category.destroy();
      return { message: "Kategoriya ro'yxatdan o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
