import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from './models/category.model';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryRepository: typeof Category,
  ) {}

  async create(categoryDto: CategoryDto) {
    try {
      const category = await this.categoryRepository.create(categoryDto);
      return { message: "Kategoriya ro'yxatga qo'shildi", category };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepository.findAll({
        include: { all: true },
      });
      return categories;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!category) {
        throw new BadRequestException('Kategoriya topilmadi!');
      }
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, categoryDto: CategoryDto) {
    try {
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
