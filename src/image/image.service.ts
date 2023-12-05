import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './models/image.model';
import { FilesService } from 'src/files/files.service';
import { ProductService } from 'src/product/product.service';
import { ImageDto } from './dto/image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image) private imageRepository: typeof Image,
    private readonly fileService: FilesService,
    private readonly productService: ProductService,
  ) {}

  async create(imageDto: ImageDto, file: any): Promise<object> {
    try {
      await this.productService.getById(imageDto.product_id);
      const file_name = await this.fileService.createFile(file);
      const image = await this.imageRepository.create({
        ...imageDto,
        image: file_name,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: "Rasm mahsulotga qo'shildi",
        data: {
          image,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const images = await this.imageRepository.findAll({
        include: { all: true },
      });
      if (!images) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          "Rasmlar ro'yxati bo'sh!",
        );
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          images,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const image = await this.imageRepository.findByPk(id, {
        include: { all: true },
      });
      if (!image) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Rasm topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          image,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByProductId(product_id: number): Promise<object> {
    try {
      const image = await this.imageRepository.findOne({
        where: { product_id },
        include: { all: true },
      });
      if (!image) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Mahsulotning rasmi topilmadi!',
        );
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          image,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const images = await this.imageRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.imageRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: images,
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

  async updateImage(
    id: string,
    imageDto: ImageDto,
    file: any,
  ): Promise<object> {
    try {
      const image = await this.imageRepository.findByPk(id);
      if (!image) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Rasm topilmadi!');
      }
      await this.fileService.deleteFile(image.image);
      const file_name = await this.fileService.createFile(file);
      const new_image = await this.imageRepository.update(
        { ...imageDto, image: file_name },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Rasm tahrirlandi',
        data: {
          image: new_image,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteById(id: string): Promise<object> {
    try {
      const image = await this.imageRepository.findByPk(id);
      if (!image) {
        throw new NotFoundException(HttpStatus.NOT_FOUND, 'Rasm topilmadi!');
      }
      await image.destroy();
      await this.fileService.deleteFile(image.image);
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Rasm o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteByProductId(product_id: number): Promise<object> {
    try {
      const image = await this.imageRepository.findAll({
        where: { product_id },
      });
      if (!image) {
        throw new NotFoundException(
          HttpStatus.NOT_FOUND,
          'Mahsulotning rasmlari topilmadi!',
        );
      }
      await this.imageRepository.destroy({ where: { product_id } });
      for (let i = 0; i < image.length; i++) {
        await this.fileService.deleteFile(image[i].image);
      }
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Mahsulot rasmlari o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
