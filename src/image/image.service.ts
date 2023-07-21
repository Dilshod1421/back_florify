import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './models/image.model';
import { v4 } from 'uuid';
import { ProductService } from './../product/product.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image)
    private readonly imageRepository: typeof Image,
    private readonly productService: ProductService,
  ) {}

  async create(createImageDto: CreateImageDto) {
    try {
      await this.productService.getOne(createImageDto.product_id);
      const newImage = await this.imageRepository.create({
        id: v4(),
        ...createImageDto,
      });
      return this.getOne(newImage.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return this.imageRepository.findAll({
        attributes: ['id', 'image_url', 'product_id'],
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateImageDto: UpdateImageDto) {
    try {
      const image = await this.getOne(id);
      await this.imageRepository.update(updateImageDto, {
        where: { id },
      });
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const image = await this.getOne(id);
      await this.imageRepository.destroy({ where: { id } });
      return image;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const image = await this.imageRepository.findOne({
        where: { id },
        attributes: ['id', 'image_url', 'product_id'],
      });
      if (!image) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }
      return image;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
