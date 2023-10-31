import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductService } from 'src/product/product.service';
import { ClientService } from 'src/client/client.service';
import { Op } from 'sequelize';
import { Watched } from './models/watched.model';
import { WatchedDto } from './dto/watched.dto';
import { Product } from 'src/product/models/product.model';
import { Image } from 'src/image/models/image.model';
import { Like } from 'src/like/models/like.model';
import { Client } from 'src/client/models/client.model';

@Injectable()
export class WatchedService {
  constructor(
    @InjectModel(Watched) private readonly watchedRepository: typeof Watched,
    private readonly clientService: ClientService,
    private readonly productService: ProductService,
  ) {}

  async create(watchedDto: WatchedDto) {
    try {
      await this.clientService.findById(watchedDto.client_id);
      await this.productService.findById(watchedDto.product_id);
      const exist = await this.findOne(watchedDto);
      if (exist) {
        return "Mahsulot allaqachon ko'rilganlarga qo'shilgan!";
      }
      const watched = await this.watchedRepository.create({
        ...watchedDto,
        is_watched: true,
      });
      return { message: "Mahsulot ko'rilganlarga qo'shildi", watched };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const watched = await this.watchedRepository.findAll({
        include: [
          { model: Product, include: [Image, Like] },
          { model: Client, include: [Like] },
        ],
      });
      return watched;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(watchedDto: WatchedDto) {
    try {
      const watched = await this.watchedRepository.findOne({
        where: {
          [Op.and]: [
            { client_id: watchedDto.client_id },
            { product_id: watchedDto.product_id },
          ],
        },
        include: [
          { model: Product, include: [Image, Like] },
          { model: Client, include: [Like] },
        ],
      });
      return watched;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByClientId(client_id: string) {
    try {
      const watched = await this.watchedRepository.findAll({
        where: { client_id },
        include: [
          { model: Product, include: [Image, Like] },
          { model: Client, include: [Like] },
        ],
      });
      if (!watched) {
        throw new BadRequestException("Ko'rilganlar ro'yxati bo'sh!");
      }
      return watched;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByProductId(product_id: number) {
    try {
      const watched = await this.watchedRepository.findAll({
        where: { product_id },
        include: [
          { model: Product, include: [Image, Like] },
          { model: Client, include: [Like] },
        ],
      });
      if (!watched) {
        throw new BadRequestException(
          "Ushbu mahsulotga ko'rilganlar ro'yxatida yo'q!",
        );
      }
      return watched;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(watchedDto: WatchedDto) {
    try {
      const like = await this.findOne(watchedDto);
      if (!like) {
        throw new BadRequestException(
          "Mahsulot mijozning ko'rilganlar ro'yxatida yo'q!",
        );
      }
      like.destroy();
      return {
        message: "Mahsulot ko'rilganlar ro'yxatidan olib tashlandi",
        like,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
