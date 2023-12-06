import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './models/like.model';
import { LikeDto } from './dto/like.dto';
import { ProductService } from 'src/product/product.service';
import { ClientService } from 'src/client/client.service';
import { Op } from 'sequelize';
import { Product } from 'src/product/models/product.model';
import { Image } from 'src/image/models/image.model';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like) private likeRepository: typeof Like,
    private readonly clientService: ClientService,
    private readonly productService: ProductService,
  ) {}

  async create(likeDto: LikeDto): Promise<object> {
    try {
      await this.clientService.getById(likeDto.client_id);
      await this.productService.getById(likeDto.product_id);
      const exist = await this.likeRepository.findOne({
        where: {
          [Op.and]: [
            { client_id: likeDto.client_id },
            { product_id: likeDto.product_id },
          ],
        },
      });
      if (exist) {
        throw new ConflictException(
          "Mahsulot allaqachon sevimlilar ro'yxatiga qo'shilgan!",
        );
      }
      const like = await this.likeRepository.create({
        ...likeDto,
        is_like: true,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: "Mahsulot sevimlilarga qo'shildi",
        data: {
          like,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByClientId(client_id: string): Promise<object> {
    try {
      const likes = await this.likeRepository.findAll({
        where: { client_id },
        include: [
          {
            model: Product,
            include: [{ model: Image, attributes: ['image'] }],
          },
        ],
      });
      if (!likes.length) {
        throw new NotFoundException("Sevimlilar ro'yxati bo'sh!");
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          likes,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(client_id: string, product_id: number): Promise<object> {
    try {
      const like = await this.likeRepository.findOne({
        where: {
          [Op.and]: [{ client_id }, { product_id }],
        },
        include: [{ model: Product, include: [Image] }],
      });
      if (!like) {
        throw new NotFoundException("Mahsulot sevimlilar ro'yxatida yo'q!");
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          like,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(
    client_id: string,
    page: number,
    limit: number,
  ): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const likes = await this.likeRepository.findAll({
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
      const total_count = await this.likeRepository.count({
        where: { client_id },
      });
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
        data: {
          records: likes,
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

  async delete(likeDto: LikeDto): Promise<object> {
    try {
      const like = await this.likeRepository.findOne({
        where: {
          [Op.and]: [
            { client_id: likeDto.client_id },
            { product_id: likeDto.product_id },
          ],
        },
      });
      if (!like) {
        throw new NotFoundException("Mahsulot sevimlilar ro'yxatida yo'q!");
      }
      like.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Mahsulot sevimlilar ro'yxatidan olib tashlandi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
