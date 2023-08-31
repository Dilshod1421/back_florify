import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './models/image.model';
import { FilesService } from 'src/files/files.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image)
    private readonly imageRepository: typeof Image,
    private readonly fileService: FilesService,
    private readonly productService: ProductService,
  ) {}

  async create(product_id: string, file: any) {
    try {
      await this.productService.findById(product_id);
      const file_name = await this.fileService.createFile(file);
      const image = await this.imageRepository.create({
        product_id,
        image: file_name,
      });
      return { message: 'Image created successfully', image };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const images = await this.imageRepository.findAll({
        include: { all: true },
      });
      return images;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const image = await this.imageRepository.findByPk(id, {
        include: { all: true },
      });
      if (!image) {
        throw new BadRequestException('Image not found!');
      }
      return image;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByProductId(product_id: string) {
    try {
      const image = await this.imageRepository.findOne({
        where: { product_id },
        include: { all: true },
      });
      if (!image) {
        throw new BadRequestException('Image not found!');
      }
      return image;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateById(product_id: string, file: any) {
    try {
      await this.productService.findById(product_id);
      const file_name = await this.fileService.createFile(file);
      const image = await this.imageRepository.update(
        { image: file_name },
        { where: { product_id }, returning: true },
      );
      return { message: 'Image updated successfully', image };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateByProductId(product_id: string, file: any) {
    try {
      await this.productService.findById(product_id);
      const file_name = await this.fileService.createFile(file);
      const image = await this.imageRepository.update(
        { image: file_name },
        { where: { product_id }, returning: true },
      );
      return { message: 'Image updated successfully', image };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const image = await this.findById(id);
      await image.destroy();
      return { message: 'Image removed successfully', image };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeByProductId(product_id: string) {
    try {
      const image = await this.findByProductId(product_id);
      await image.destroy();
      return { message: 'Image removed successfully', image };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
