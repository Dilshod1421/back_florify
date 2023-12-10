import { BadRequestException, Injectable } from '@nestjs/common';
import { SoldProduct } from './models/sold-product.model';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../product/models/product.model';
import { SoldProductDto } from './dto/sold-product.dto';

@Injectable()
export class SoldProductService {
  constructor(
    @InjectModel(SoldProduct) private soldProductRepository: typeof SoldProduct,
    @InjectModel(Product) private productRepository: typeof Product,
  ) {}

  async create(soldProductDto: SoldProductDto) {
    try {
      const sold_product = await this.soldProductRepository.create(
        soldProductDto,
      );
      const product = await this.productRepository.findOne({
        where: { id: soldProductDto.product_id },
      });
      const residual = product.quantity - soldProductDto.how_many;
      await this.productRepository.update(
        { quantity: residual },
        { where: { id: product.id } },
      );
      return { message: 'Mahsulot sotildi', sold_product };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll() {
    try {
      const sold_products = await this.soldProductRepository.findAll({
        include: { all: true },
      });
      return sold_products;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string) {
    try {
      const sold_product = await this.soldProductRepository.findOne({
        where: { id },
      });
      if (!sold_product) {
        throw new BadRequestException('Sotilgan mahsulot topilmadi!');
      }
      return sold_product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit) {
    try {
      const offset = (page - 1) * limit;
      const sold_products = await this.soldProductRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.soldProductRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: sold_products,
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

  async update(id: string, soldProductDto: SoldProductDto) {
    try {
      const sold_product = await this.getById(id);
      const updated_info = await this.soldProductRepository.update(
        soldProductDto,
        { where: { id: sold_product.id }, returning: true },
      );
      const product = await this.productRepository.findOne({
        where: { id: soldProductDto.product_id },
      });
      const residual = product.quantity - soldProductDto.how_many;
      await this.productRepository.update(
        { quantity: residual },
        { where: { id: product.id } },
      );
      return {
        message: 'Sotilgan mahsulot tahrirlandi',
        sold_product: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const sold_product = await this.getById(id);
      sold_product.destroy();
      return { message: "Sotilgan mahsulot o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
