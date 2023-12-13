import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductService } from 'src/product/product.service';
import { ClientService } from 'src/client/client.service';
import { Op } from 'sequelize';
import { Product } from 'src/product/models/product.model';
import { Image } from 'src/image/models/image.model';
import { Cart } from './models/cart.model';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart) private cartRepository: typeof Cart,
    private readonly clientService: ClientService,
    private readonly productService: ProductService,
  ) {}

  async create(cartDto: CartDto): Promise<object> {
    try {
      const { client_id, product_id } = cartDto;
      await this.clientService.getById(client_id);
      await this.productService.getById(Number(product_id));
      const exist = await this.cartRepository.findOne({
        where: { [Op.and]: [{ client_id }, { product_id }] },
      });
      if (exist) {
        throw new ConflictException("Mahsulot allaqachon savatga qo'shilgan!");
      }
      const cart = await this.cartRepository.create(cartDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: "Mahsulot savatchaga qo'shildi",
        data: {
          cart,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByClientId(client_id: string): Promise<object> {
    try {
      const carts = await this.cartRepository.findAll({
        where: { client_id },
        include: [{ model: Product, include: [Image] }],
      });
      return {
        statusCode: HttpStatus.OK,
        data: {
          carts,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByCartIdAndClientId(id: string, client_id: string): Promise<object> {
    try {
      const cart = await this.cartRepository.findOne({
        where: { [Op.and]: [{ id }, { client_id }] },
        include: [{ model: Product, include: [Image] }],
      });
      if (!cart) {
        throw new NotFoundException('Mahsulot topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          cart,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByClientIdWithPagination(
    client_id: string,
    page: number,
    limit: number,
  ): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const carts = await this.cartRepository.findAll({
        where: { client_id },
        offset,
        limit,
      });
      const total_count = await this.cartRepository.count({
        where: { client_id },
      });
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: carts,
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

  async deleteCart(id: string) {
    try {
      const cart = await this.cartRepository.findByPk(id);
      if (!cart) {
        throw new NotFoundException('Mahsulot topilmadi!');
      }
      cart.destroy();
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Mahsulot savatchadan o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
