import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { ProductDto } from './dto/product.dto';
import { Image } from 'src/image/models/image.model';
import { Op } from 'sequelize';
import { SalesmanService } from 'src/salesman/salesman.service';
import { CategoryService } from 'src/category/category.service';
import { UpdateProducDto } from './dto/update-product.dto';
import { FilesService } from 'src/files/files.service';
import { Like } from 'src/like/models/like.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Image) private imageRepository: typeof Image,
    private readonly salesmanService: SalesmanService,
    private readonly categoryService: CategoryService,
    private readonly fileService: FilesService,
  ) {}

  async create(productDto: ProductDto): Promise<object> {
    try {
      await this.salesmanService.getById(productDto.salesman_id);
      await this.categoryService.getById(productDto.category_id);
      const date = new Date().toISOString().slice(0, 10);
      const product = await this.productRepository.create({
        ...productDto,
        date,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: "Mahsulot qo'shildi",
        data: {
          product,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const products = await this.productRepository.findAll({
        include: { model: Image, attributes: ['image'] },
      });
      return {
        statusCode: HttpStatus.OK,
        data: {
          products,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: number): Promise<object> {
    try {
      const product = await this.productRepository.findByPk(id, {
        include: { model: Image, attributes: ['image'] },
      });
      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          product,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByCategoryId(
    category_id: string,
    page: number,
    limit: number,
  ): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const products = await this.productRepository.findAll({
        where: { category_id },
        include: [
          { model: Image, attributes: ['image'] },
          { model: Like, attributes: ['is_like', 'client_id'] },
        ],
        offset,
        limit,
      });
      const total_count = await this.productRepository.count({
        where: { category_id },
      });
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
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

  async getBySalesmanId(
    salesman_id: string,
    page: number,
    limit: number,
    quantity: string,
  ): Promise<object> {
    try {
      await this.salesmanService.getById(salesman_id);
      const offset = (page - 1) * limit;
      if (quantity == 'All') {
        const products = await this.productRepository.findAll({
          where: { salesman_id },
          include: { model: Image, attributes: ['image'] },
          offset,
          limit,
        });
        const total_count = await this.productRepository.count({
          where: { salesman_id },
        });
        const total_pages = Math.ceil(total_count / limit);
        const response = {
          status: HttpStatus.OK,
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
      }
      let where: any = { salesman_id };
      if (quantity == 'on_sale') {
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
        include: [
          { model: Image, attributes: ['image'] },
          { model: Like, attributes: ['is_like', 'client_id'] },
        ],
      });
      const total_count = await this.productRepository.count({
        where,
      });
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
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

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const products = await this.productRepository.findAll({
        include: [
          { model: Image, attributes: ['image'] },
          { model: Like, attributes: ['is_like', 'client_id'] },
        ],
        offset,
        limit,
      });
      const total_count = await this.productRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
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

  async presents(page: number, limit: number): Promise<object> {
    try {
      const date = new Date().toISOString().slice(0, 10);
      const offset = (page - 1) * limit;
      console.log(page, limit, offset);
      const products = await this.productRepository.findAll({
        where: { date },
        include: [
          { model: Image, attributes: ['image'] },
          { model: Like, attributes: ['is_like', 'client_id'] },
        ],
        offset,
        limit,
      });
      const total_count = await this.productRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
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

  async update(id: number, updateProductDto: UpdateProducDto): Promise<object> {
    try {
      const product = await this.productRepository.findByPk(id);
      if (!product) {
        throw new NotFoundException('Mahsulot topilmaadi!');
      }
      const {
        name,
        price,
        quantity,
        description,
        color,
        salesman_id,
        category_id,
      } = updateProductDto;
      let dto = {};
      if (!name) {
        dto = Object.assign(dto, { name: product.name });
      }
      if (!price) {
        dto = Object.assign(dto, { price: product.price });
      }
      if (!quantity) {
        dto = Object.assign(dto, { quantity: product.quantity });
      }
      if (!description) {
        dto = Object.assign(dto, { description: product.description });
      }
      if (!color) {
        dto = Object.assign(dto, { color: product.color });
      }
      if (!salesman_id) {
        dto = Object.assign(dto, { salesman_id: product.salesman_id });
      }
      if (!category_id) {
        dto = Object.assign(dto, { category_id: product.category_id });
      }
      if (salesman_id) {
        await this.salesmanService.getById(salesman_id);
      }
      if (category_id) {
        await this.categoryService.getById(category_id);
      }
      const obj = Object.assign(updateProductDto, dto);
      const update = await this.productRepository.update(obj, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: "Mahsulot ma'lumotlari tahrirlandi",
        data: {
          product: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number): Promise<object> {
    try {
      const product = await this.productRepository.findByPk(id);
      if (!product) {
        throw new NotFoundException('Mahsulot topilmadi!');
      }
      const images = await this.imageRepository.findAll({
        where: { product_id: id },
      });
      for (let i = 0; i < images.length; i++) {
        await this.fileService.deleteFile(images[i].image);
      }
      product.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Mahsulot o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
