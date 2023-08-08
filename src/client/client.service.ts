import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client)
    private readonly clientRepository: typeof Client,
  ) {}

  async create(clientDto: ClientDto) {
    try {
      const exist_phone = await this.clientRepository.findOne({
        where: { phone: clientDto.phone },
      });
      if (exist_phone) {
        throw new BadRequestException('Bu telefon raqam band!');
      }
      const client = await this.clientRepository.create(clientDto);
      return { message: "Mijoz ro'yxatga kiritildi", client };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const clients = await this.clientRepository.findAll({
        include: { all: true },
      });
      return clients;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async paginate(page: number) {
    try {
      page = Number(page);
      const limit = 10;
      const offset = (page - 1) * limit;
      const clients = await this.clientRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.clientRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const res = {
        status: 200,
        data: {
          records: clients,
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
      const client = await this.clientRepository.findOne({
        where: { id },
        include: { all: true },
      });
      if (!client) {
        throw new BadRequestException('Mijoz topilmadi!');
      }
      return client;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, clientDto: ClientDto) {
    try {
      const client = await this.findById(id);
      if (clientDto.phone) {
        const exist_phone = await this.clientRepository.findOne({
          where: { phone: clientDto.phone },
        });
        if (exist_phone) {
          if (client.id != exist_phone.id) {
            throw new BadRequestException('Bu telefon raqam band!');
          }
        }
      }
      const updated_info = await this.clientRepository.update(clientDto, {
        where: { id },
        returning: true,
      });
      return {
        message: "Mijoz ma'lumotlari tahrirlandi",
        client: updated_info[1][0],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const client = await this.findById(id);
      client.destroy();
      return { message: "Mijoz o'chirildi" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
