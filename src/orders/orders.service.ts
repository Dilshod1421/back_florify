import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderStatus } from './models/order.model';
import { Repository } from 'sequelize-typescript';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Client } from 'src/client/models/client.model';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/models/product.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderRepository: Repository<Order>,
    private readonly productService: ProductService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.findAll({
      include: [Client],
    });
  }

  async findById(id: string): Promise<object> {
    try {
      const order = await this.orderRepository.findByPk(id);
      if (!order) {
        throw new NotFoundException('Order topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          order,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(orderData: CreateOrderDto): Promise<object> {
    let totalAmount = 0;
    const product_ids = orderData.items.map((item) => item.product_id);
    const products_in_object = {};

    const available_products = await this.productService.findByOptions({
      where: {
        id: product_ids,
      },
      raw: true,
    });

    available_products.forEach((item) => {
      products_in_object[item.id] = item;
    });
    for (const item of orderData.items) {
      const real_product = products_in_object[item.product_id] as Product;

      if (!real_product) {
        throw new BadRequestException(`Ayrim mahsulotlar omborda mavjud emas`);
      }
      if (real_product.quantity < item.quantity) {
        throw new BadRequestException(
          `${real_product.name} mahsuloti miqdori yetarli emas!`,
        );
      }
      totalAmount += real_product.price * item.quantity;
    }

    const order = await this.orderRepository.create({
      ...orderData,
      totalAmount,
      status: OrderStatus.PENDING,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order yaratildi',
      data: {
        order,
      },
    };
  }

  async update(id: string, orderData: UpdateOrderDto): Promise<object> {
    try {
      await this.findById(id);
      const order = await this.orderRepository.update(orderData, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Order tahrirlandi',
        data: {
          order,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    try {
      await this.findById(id);
      await this.orderRepository.update(
        { status }, 
        { where: { id } }
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<object> {
    try {
      await this.findById(id);
      await this.orderRepository.destroy({ where: { id } });
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: "Order o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
