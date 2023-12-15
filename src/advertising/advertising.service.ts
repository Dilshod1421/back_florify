import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdvertisingDto } from './dto/create-advertising.dto';
import { UpdateAdvertisingDto } from './dto/update-advertising.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Advertising } from './models/advertising.model';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AdvertisingService {
  constructor(
    @InjectModel(Advertising) private advertisingRepository: typeof Advertising,
    private readonly fileService: FilesService,
  ) {}

  async create(
    createAdvertisingDto: CreateAdvertisingDto,
    file: any,
  ): Promise<object> {
    try {
      const file_name = await this.fileService.createFile(file);
      const advertising = await this.advertisingRepository.create({
        image: file_name,
        ...createAdvertisingDto,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: "Reklama qo'shildi",
        data: {
          advertising,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const advertisings = await this.advertisingRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: {
          advertisings,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const advertising = await this.advertisingRepository.findByPk(id);
      if (!advertising) {
        throw new NotFoundException('Reklama topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          advertising,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    updateAdvertisingDto: UpdateAdvertisingDto,
    file: any,
  ): Promise<object> {
    try {
      const advertising = await this.advertisingRepository.findByPk(id);
      if (!advertising) {
        throw new NotFoundException('Reklama topilmadi!');
      }
      let dto = {};
      if (!updateAdvertisingDto.discount) {
        dto = { discount: advertising.discount };
      }
      if (updateAdvertisingDto.discount) {
        dto = { discount: updateAdvertisingDto.discount };
      }
      if (!file) {
        const update = await this.advertisingRepository.update(
          { ...dto, image: advertising.image },
          { where: { id }, returning: true },
        );
        return {
          statusCode: HttpStatus.OK,
          message: 'Reklama tahrirlandi',
          data: {
            advertising: update[1][0],
          },
        };
      }
      await this.fileService.deleteFile(advertising.image);
      const file_name = await this.fileService.createFile(file);
      const update = await this.advertisingRepository.update(
        { ...dto, image: file_name },
        { where: { id }, returning: true },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Reklama tahrirlandi',
        data: {
          advertising: update[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<object> {
    try {
      const advertising = await this.advertisingRepository.findByPk(id);
      if (!advertising) {
        throw new NotFoundException('Reklama topilmadi!');
      }
      await this.fileService.deleteFile(advertising.image);
      advertising.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Reklama o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
