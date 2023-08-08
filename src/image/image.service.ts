import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './models/image.model';
import { ImageDto } from './dto/image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image)
    private readonly imageRepository: typeof Image,
  ) {}

  async create(imageDto: ImageDto) {
    try {
      const image = await this.imageRepository.create(imageDto);
      return { message: "Rasm qo'shildi", image };
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

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const images = await this.imageRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.imageRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: images,
          pagination: {
            currentPage: page,
            total_pages,
            total_count,
          },
        },
      };
      return res;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const image = await this.imageRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!image) {
        throw new BadRequestException('Rasm topilmadi!');
      }
      return image;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, imageDto: ImageDto) {
    try {
      const image = await this.findById(id);
      const updated_info = await this.imageRepository.update(imageDto, {
        where: { id: image.id },
        returning: true,
      });
      return { message: 'Rasm tahrirlandi', image: updated_info[1][0] };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const image = await this.findById(id);
      image.destroy();
      return { message: "Rasm o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
