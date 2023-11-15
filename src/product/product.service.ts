import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { ProductDto } from './dto/product.dto';
import { Like } from 'src/like/models/like.model';
import { SoldProduct } from 'src/sold-product/models/sold-product.model';
import { Image } from 'src/image/models/image.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product,
  ) {}

  async create(productDto: ProductDto) {
    try {
      const date = new Date().toISOString().slice(0, 10);
      const product = await this.productRepository.create({
        ...productDto,
        date,
      });
      return { message: "Mahsulot qo'shildi", product };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const products = await this.productRepository.findAll({
        include: [{ model: Like }, { model: SoldProduct }, { model: Image }],
      });
      return products;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const products = await this.productRepository.findAll({
        include: [{ model: Like }, { model: SoldProduct }, { model: Image }],
        offset,
        limit,
      });
      const total_count = await this.productRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: 200,
        data: {
          records: products,
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

  async getByCategoryId(id_page_limit: string) {
    try {
      const category_id = id_page_limit.split(':')[0];
      const page = Number(id_page_limit.split(':')[1]);
      const limit = Number(id_page_limit.split(':')[2]);
      const offset = (page - 1) * limit;
      const products = await this.productRepository.findAll({
        where: { category_id },
        include: [{ model: Like }, { model: SoldProduct }, { model: Image }],
        offset,
        limit,
      });
      const total_count = await this.productRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: 200,
        data: {
          records: products,
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

  async presents() {
    try {
      const date = new Date().toISOString().slice(0, 10);
      const products = await this.productRepository.findAll({
        where: { date },
        include: [{ model: Like }, { model: SoldProduct }, { model: Image }],
      });
      return products;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        include: [{ model: Like }, { model: SoldProduct }, { model: Image }],
      });
      if (!product) {
        throw new BadRequestException('Mahsulot topilmadi!');
      }
      return product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, productDto: ProductDto) {
    try {
      const product = await this.findById(id);
      const updated_info = await this.productRepository.update(productDto, {
        where: { id: product.id },
        returning: true,
      });
      return {
        message: 'Mahsulot tafsilotlari tahrirlandi',
        product: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.findById(id);
      await product.destroy();
      return { message: "Mahsulot o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
