import { BadRequestException, Injectable } from '@nestjs/common';
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
    @InjectModel(Cart) private readonly cartRepository: typeof Cart,
    private readonly clientService: ClientService,
    private readonly productService: ProductService,
  ) {}

  async create(cartDto: CartDto) {
    try {
      await this.clientService.findById(cartDto.client_id);
      await this.productService.findById(cartDto.product_id);
      const exist = await this.findOne(cartDto);
      if (exist) {
        return "Mahsulot allaqachon savatchaga qo'shilgan!";
      }
      const cart = await this.cartRepository.create(cartDto);
      return { message: "Mahsulot savatchaga qo'shildi", cart };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const carts = await this.cartRepository.findAll({
        include: [{ model: Product, include: [Image] }],
      });
      return carts;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(cartDto: CartDto) {
    try {
      const cart = await this.cartRepository.findOne({
        where: {
          [Op.and]: [
            { client_id: cartDto.client_id },
            { product_id: cartDto.product_id },
          ],
        },
        include: [{ model: Product, include: [Image] }],
      });
      return cart;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByClientId(client_id: string) {
    try {
      const carts = await this.cartRepository.findAll({
        where: { client_id },
        include: [{ model: Product, include: [Image] }],
      });
      if (!carts) {
        throw new BadRequestException("Savatcha bo'sh!");
      }
      return carts;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByProductId(product_id: number) {
    try {
      const carts = await this.cartRepository.findAll({
        where: { product_id },
        include: [{ model: Product, include: [Image] }],
      });
      if (!carts) {
        throw new BadRequestException("Ushbu mahsulot savatchada yo'q!");
      }
      return carts;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(cartDto: CartDto) {
    try {
      const cart = await this.findOne(cartDto);
      if (!cart) {
        throw new BadRequestException(
          "Mahsulot mijozning savatchasida yo'q!",
        );
      }
      cart.destroy();
      return {
        message: "Mahsulot savatchadan olib tashlandi",
        cart,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
