import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SocialNetwork } from './models/social-network.model';
import { SocialNetworkDto } from './dto/social-network.dto';

@Injectable()
export class SocialNetworkService {
  constructor(
    @InjectModel(SocialNetwork)
    private readonly socialNetworkRepository: typeof SocialNetwork,
  ) {}

  async create(socialNetworkDto: SocialNetworkDto) {
    try {
      const social_network = await this.socialNetworkRepository.create(
        socialNetworkDto,
      );
      return {
        message: "Ijtimoiy tarmoqdagi sahifa qo'shildi",
        social_network,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const social_networks = await this.socialNetworkRepository.findAll({
        include: { all: true },
      });
      return social_networks;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const social_networks = await this.socialNetworkRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.socialNetworkRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: social_networks,
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
      const social_network = await this.socialNetworkRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!social_network) {
        throw new BadRequestException('Ijtimoiy tarmoqdagi sahifa topilmadi!');
      }
      return social_network;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, socialNetworkDto: SocialNetworkDto) {
    try {
      const social_network = await this.findById(id);
      const updated_info = await this.socialNetworkRepository.update(
        socialNetworkDto,
        { where: { id: social_network.id }, returning: true },
      );
      return {
        message: 'Ijtimoiy tarmoqdagi sahifa tahrirlandi',
        social_network: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const social_network = await this.findById(id);
      social_network.destroy();
      return { message: "Ijtimoiy tarmoqdagi sahifa o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
