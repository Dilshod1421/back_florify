import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product,
  ) {}

  async create(productDto: ProductDto) {
    try {
      const product = await this.productRepository.create(productDto);
      return { message: "Mahsulot qo'shildi", product };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const products = await this.productRepository.findAll({
        include: { all: true },
      });
      return products;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const products = await this.productRepository.findAll({
        include: { all: true },
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

  async findById(id: string) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new BadRequestException('Mahsulot topilmadi!');
      }
      return product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, productDto: ProductDto) {
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

  async remove(id: string) {
    try {
      const product = await this.findById(id);
      product.destroy();
      return { message: "Mahsulot o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
