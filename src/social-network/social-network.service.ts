import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SocialNetwork } from './models/social-network.model';
import { SocialNetworkDto } from './dto/social-network.dto';
import { UpdateSocialDto } from './dto/update-social-network.dto';

@Injectable()
export class SocialNetworkService {
  constructor(
    @InjectModel(SocialNetwork)
    private socialNetworkRepository: typeof SocialNetwork,
  ) {}

  async create(socialNetworkDto: SocialNetworkDto): Promise<object> {
    try {
      const social_network = await this.socialNetworkRepository.create(
        socialNetworkDto,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: "Ijtimoiy tarmoqdagi sahifa qo'shildi",
        data: {
          social_network,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<object> {
    try {
      const social_networks = await this.socialNetworkRepository.findAll();
      return {
        statusCode: HttpStatus.OK,
        data: {
          social_networks,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getById(id: string): Promise<object> {
    try {
      const social_network = await this.socialNetworkRepository.findByPk(id);
      if (!social_network) {
        throw new NotFoundException('Ijtimoiy tarmoqdagi sahifa topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          social_network,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const social_networks = await this.socialNetworkRepository.findAll({
        offset,
        limit,
      });
      const total_count = await this.socialNetworkRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        status: HttpStatus.OK,
        data: {
          records: social_networks,
          pagination: {
            currentPage: Number(page),
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

  async update(id: string, updateSocialDto: UpdateSocialDto): Promise<object> {
    try {
      const social_network = await this.socialNetworkRepository.findByPk(id);
      if (!social_network) {
        throw new NotFoundException('Ijtimoiy tarmoqdagi sahifa topilmadi!');
      }
      const { name, link } = updateSocialDto;
      let dto: {};
      if (!name) {
        dto = Object.assign(dto, { name: social_network.name });
      }
      if (!link) {
        dto = Object.assign(dto, { name: social_network.link });
      }
      const obj = Object.assign(dto, updateSocialDto);
      const updated_info = await this.socialNetworkRepository.update(obj, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Ijtimoiy tarmoqdagi sahifa tahrirlandi',
        data: {
          social_network: updated_info[1][0],
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<object> {
    try {
      const social_network = await this.socialNetworkRepository.findByPk(id);
      if (!social_network) {
        throw new NotFoundException('Ijtimoiy tarmoqdagi sahifa topilmadi!');
      }
      social_network.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Ijtimoiy tarmoqdagi sahifa o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
