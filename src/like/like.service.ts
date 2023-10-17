import { BadRequestException, Injectable } from '@nestjs/common';
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
    @InjectModel(Like) private readonly likeRepository: typeof Like,
    private readonly clientService: ClientService,
    private readonly productService: ProductService,
  ) {}

  async create(likeDto: LikeDto) {
    try {
      await this.clientService.findById(likeDto.client_id);
      await this.productService.findById(likeDto.product_id);
      const exist = await this.findOne(likeDto);
      if (exist) {
        throw new BadRequestException(
          "Mahsulot allaqachon sevimlilar ro'yxatiga qo'shilgan!",
        );
      }
      const like = await this.likeRepository.create({
        ...likeDto,
        is_like: true,
      });
      return { message: "Mahsulot sevimlilarga qo'shildi", like };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const likes = await this.likeRepository.findAll({
        include: { all: true },
      });
      return likes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(likeDto: LikeDto) {
    try {
      const like = await this.likeRepository.findOne({
        where: {
          [Op.and]: [
            { client_id: likeDto.client_id },
            { product_id: likeDto.product_id },
          ],
        },
      });
      return like;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByClientId(client_id: string) {
    try {
      const likes = await this.likeRepository.findAll({
        where: { client_id },
        include: [{ model: Product, include: [Image] }],
      });
      if (!likes) {
        throw new BadRequestException("Sevimlilar ro'yxati bo'sh!");
      }
      return likes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByProductId(product_id: number) {
    try {
      const likes = await this.likeRepository.findAll({
        where: { product_id },
        include: { all: true },
      });
      if (!likes) {
        throw new BadRequestException("Ushbu mahsulotga tegishli like yo'q!");
      }
      return likes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(likeDto: LikeDto) {
    try {
      const like = await this.findOne(likeDto);
      if (!like) {
        throw new BadRequestException(
          "Mahsulot mijozning sevimlilar ro'yxatida yo'q!",
        );
      }
      like.destroy();
      return {
        message: "Mahsulot sevimlilar ro'yxatidan olib tashlandi",
        like,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
