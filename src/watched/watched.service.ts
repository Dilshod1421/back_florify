import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from 'src/product/models/product.model';
import { Image } from 'src/image/models/image.model';
import { Watched } from './models/watched.model';

@Injectable()
export class WatchedService {
  constructor(
    @InjectModel(Watched) private watchedRepository: typeof Watched,
  ) {}

  async create(product_id: number): Promise<object> {
    try {
      const watched = await this.watchedRepository.create({ product_id });
      return {
        statusCode: HttpStatus.CREATED,
        message: "Mahsulot ko'rilganlar ro'yxatiga qo'shildi",
        data: {
          watched,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const watcheds = await this.watchedRepository.findAll({
        include: { model: Product, include: [Image] },
      });
      return {
        statusCode: HttpStatus.OK,
        data: {
          watcheds,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByProductId(product_id: number): Promise<object> {
    try {
      const watcheds = await this.watchedRepository.findAll({
        where: { product_id },
        include: { model: Product, include: [Image] },
      });
      return {
        statusCode: HttpStatus.OK,
        data: {
          watcheds,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const watcheds = await this.watchedRepository.findAll({
        include: [
          {
            model: Product,
            include: [{ model: Image }],
          },
        ],
        offset,
        limit,
      });
      const total_count = await this.watchedRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
        data: {
          records: watcheds,
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
}
