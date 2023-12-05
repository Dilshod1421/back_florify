import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductService } from 'src/product/product.service';
import { ClientService } from 'src/client/client.service';
import { Op } from 'sequelize';
import { Product } from 'src/product/models/product.model';
import { Image } from 'src/image/models/image.model';
import { Watched } from './models/watched.model';
import { WatchedDto } from './dto/watched.dto';

@Injectable()
export class WatchedService {
  constructor(
    @InjectModel(Watched) private readonly watchedRepository: typeof Watched,
    private readonly clientService: ClientService,
    private readonly productService: ProductService,
  ) {}

  async create(watchedDto: WatchedDto): Promise<object> {
    try {
      await this.clientService.getById(watchedDto.client_id);
      await this.productService.getById(watchedDto.product_id);
      const exist = await this.getOne(
        watchedDto.client_id + '_' + watchedDto.product_id,
      );
      if (exist) {
        throw new ConflictException(
          HttpStatus.CONFLICT,
          "Mahsulot allaqachon ko'rilganlar ro'yxatiga qo'shilgan!",
        );
      }
      const watched = await this.watchedRepository.create({
        ...watchedDto,
        is_watched: true,
      });
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

  async getByClientId(client_id: string): Promise<object> {
    try {
      const watcheds = await this.watchedRepository.findAll({
        where: { client_id },
        include: [
          {
            model: Product,
            include: [{ model: Image, attributes: ['image'] }],
          },
        ],
      });
      if (!watcheds) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          "Ko'rilganlar ro'yxati bo'sh!",
        );
      }
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

  async getOne(clienId_productId: string): Promise<object> {
    try {
      const array = clienId_productId.split('_');
      const client_id = array[0];
      const product_id = Number(array[1]);
      const watcheds = await this.watchedRepository.findOne({
        where: {
          [Op.and]: [{ client_id }, { product_id }],
        },
        include: [{ model: Product, include: [Image] }],
      });
      if (!watcheds) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          "Mahsulot ko'rilganlar ro'yxatida yo'q!",
        );
      }
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

  async pagination(clientId_page_limit: string): Promise<object> {
    try {
      const array = clientId_page_limit.split('_');
      const client_id = array[0];
      const page = Number(array[1]);
      const limit = Number(array[2]);
      const offset = (page - 1) * limit;
      const watcheds = await this.watchedRepository.findAll({
        where: { client_id },
        include: [
          {
            model: Product,
            include: [{ model: Image, attributes: ['image'] }],
          },
        ],
        offset,
        limit,
      });
      const total_count = await this.watchedRepository.count({
        where: { client_id },
      });
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
        data: {
          records: watcheds,
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

  async delete(watchedDto: WatchedDto): Promise<object> {
    try {
      const like = await this.watchedRepository.findOne({
        where: {
          [Op.and]: [
            { client_id: watchedDto.client_id },
            { product_id: watchedDto.product_id },
          ],
        },
      });
      if (!like) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          "Mahsulot ko'rilganlar ro'yxatida yo'q!",
        );
      }
      like.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Mahsulot ko'rilganlar ro'yxatidan olib tashlandi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
