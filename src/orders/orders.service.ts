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

  async findById(id: number): Promise<object> {
    try {
      const order = await this.orderRepository.findByPk(id, {
        include: [Client],
      });
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

  async getByClientId(client_id: string): Promise<object> {
    try {
      const orders = await this.orderRepository.findAll({
        where: { client_id },
      });
      return {
        statusCode: HttpStatus.OK,
        data: {
          orders,
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
    for (const [i, item] of orderData.items.entries()) {
      const real_product = products_in_object[item.product_id] as Product;

      if (!real_product) {
        throw new BadRequestException(`Ayrim mahsulotlar omborda mavjud emas`);
      }
      if (real_product.quantity < item.quantity) {
        throw new BadRequestException(
          `${real_product.name} mahsuloti miqdori yetarli emas!`,
        );
      }
      orderData.items[i] = Object.assign(orderData.items[i], {
        product: real_product,
      });
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

  async update(id: number, orderData: UpdateOrderDto): Promise<object> {
    try {
      await this.findById(id);

      if (orderData.totalAmount) {
        throw new BadRequestException(
          'Umumiy mablagni ozgartirish mumkin emas!',
        );
      }
      if (orderData.items) {
        let totalAmount = 0;
        for (const [i, item] of orderData.items.entries()) {
          const productResponse: any = await this.productService.getById(
            item.product_id,
          );
          const real_product = productResponse.data.product as Product;

          if (real_product.quantity < item.quantity) {
            throw new BadRequestException(
              `${real_product.name} mahsuloti miqdori yetarli emas!`,
            );
          }
          orderData.items[i] = Object.assign(orderData.items[i], {
            product: real_product,
          });
          totalAmount += real_product.price * item.quantity;
        }
        orderData.totalAmount = totalAmount;
      }

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

  async updateStatus(id: number, status: OrderStatus): Promise<void> {
    try {
      await this.findById(id);
      await this.orderRepository.update({ status }, { where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const orders = await this.orderRepository.findAll({
        include: [Client],
        offset,
        limit,
      });
      const total_count = await this.orderRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        statusCode: HttpStatus.OK,
        data: {
          records: orders,
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

  async delete(id: number): Promise<object> {
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
