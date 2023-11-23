import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { ProductDto } from './dto/product.dto';
import { Like } from 'src/like/models/like.model';
import { SoldProduct } from 'src/sold-product/models/sold-product.model';
import { Image } from 'src/image/models/image.model';
import { Op, Sequelize } from 'sequelize';

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

  async findAll(page_limit: string) {
    try {
      const page = Number(page_limit.split(':')[0]);
      const limit = Number(page_limit.split(':')[1]);
      const offset = (page - 1) * limit;
      console.log(page, limit, offset);
      const products = await this.productRepository.findAll({
        include: [{ model: Like }, { model: SoldProduct }, { model: Image }],
        order: [['id', 'DESC']],
        offset,
        limit,
      });
      const total_count = await this.productRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      return {
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
      const total_count = await this.productRepository.count({
        where: { category_id },
      });
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

  async getBySalesmanId(salesman_id_page_limit: string, quantity: string) {
    try {
      const salesman_id = salesman_id_page_limit.split(':')[0];
      const page = Number(salesman_id_page_limit.split(':')[1]);
      const limit = Number(salesman_id_page_limit.split(':')[2]);
      const offset = (page - 1) * limit;
      let where: any = { salesman_id };
      if (quantity == 'All') {
      } else if (quantity == 'on_sale') {
        where.quantity = {
          [Op.ne]: 0,
        };
      } else {
        where.quantity = 0;
      }
      const products = await this.productRepository.findAll({
        where,
        offset,
        limit,
        include: [{ model: Image }],
        attributes: {
          include: [
            [
              Sequelize.literal(
                '(SELECT COUNT(*) FROM "like" WHERE "like"."product_id" = "Product"."id")',
              ),
              'likeCount',
            ],
            [
              Sequelize.literal(
                '(SELECT COUNT(*) FROM "sold-product" WHERE "sold-product"."product_id" = "Product"."id")',
              ),
              'soldProductCount',
            ],
            [
              Sequelize.literal(
                '(SELECT COUNT(*) FROM "watched" WHERE "watched"."product_id" = "Product"."id")',
              ),
              'watchedCount',
            ],
          ],
        },
      });
      const total_count = await this.productRepository.count({
        where,
      });
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

  async presents(page_limit: string) {
    try {
      const date = new Date().toISOString().slice(0, 10);
      const page = Number(page_limit.split(':')[0]);
      const limit = Number(page_limit.split(':')[1]);
      const offset = (page - 1) * limit;
      console.log(page, limit, offset);
      const products = await this.productRepository.findAll({
        where: { date },
        include: [{ model: Like }, { model: SoldProduct }, { model: Image }],
        offset,
        limit,
      });
      const total_count = await this.productRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      return {
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
