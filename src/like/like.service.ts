import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './models/like.model';
import { LikeDto } from './dto/like.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like) private readonly likeRepository: typeof Like,
    private readonly productService: ProductService,
  ) {}

  async create(likeDto: LikeDto) {
    try {
      await this.productService.findById(likeDto.product_id);
      const like = await this.likeRepository.create({
        is_like: true,
        product_id: likeDto.product_id,
      });
      return { message: 'Mahsulotga layk bosildi', like };
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

  async findByProductId(likeDto: LikeDto) {
    try {
      const likes = await this.likeRepository.findAll({
        where: { product_id: likeDto.product_id },
        include: { all: true },
      });
      if (!likes) {
        throw new BadRequestException('Mahsulot topilmadi!');
      }
      return likes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const like = await this.likeRepository.findOne({
        where: { id },
      });
      if (!like) {
        throw new BadRequestException('Layk topilmadi!');
      }
      console.log(like);
      like.destroy();
      return { message: 'Mahsulotdan layk olib tashlandi', like };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
