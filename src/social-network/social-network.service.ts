import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SocialNetwork } from './models/social-network.model';
import { v4 } from 'uuid';
import { SalesmanService } from './../salesman/salesman.service';

@Injectable()
export class SocialNetworkService {
  constructor(
    @InjectModel(SocialNetwork)
    private readonly socialNetworkRepository: typeof SocialNetwork,
    private readonly salesmanService: SalesmanService,
  ) {}

  async create(createSocialNetworkDto: CreateSocialNetworkDto) {
    try {
      await this.salesmanService.findById(createSocialNetworkDto.salesman_id);
      const newSocialNetwork = await this.socialNetworkRepository.create({
        id: v4(),
        ...createSocialNetworkDto,
      });
      return this.getOne(newSocialNetwork.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return this.socialNetworkRepository.findAll({
        attributes: ['id', 'name', 'link', 'salesman_id'],
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

  async update(id: string, updateSocialNetworkDto: UpdateSocialNetworkDto) {
    try {
      const socialNetwork = await this.getOne(id);
      await this.socialNetworkRepository.update(updateSocialNetworkDto, {
        where: { id },
      });
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const socialNetwork = await this.getOne(id);
      await this.socialNetworkRepository.destroy({ where: { id } });
      return socialNetwork;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const SocialNetwork = await this.socialNetworkRepository.findOne({
        where: { id },
        attributes: ['id', 'name', 'link', 'salesman_id'],
      });
      if (!SocialNetwork) {
        throw new HttpException(
          'Social Network not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return SocialNetwork;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
