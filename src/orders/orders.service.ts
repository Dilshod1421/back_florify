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
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/models/product.model';
import { Op, WhereOptions, literal } from 'sequelize';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private orderRepository: Repository<Order>,
    private readonly productService: ProductService,
  ) {}

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
          `${real_product.name} mahsulot miqdori yetarli emas!`,
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
      message: 'Buyurtma qabul qilindi',
      data: {
        order,
      },
    };
  }

  async findAll(): Promise<Order[]> {
    let orders = await this.orderRepository.findAll({
      include: { all: true },
    });

    orders = await this.setProducts(orders);

    return orders;
  }

  async findById(id: number): Promise<object> {
    try {
      let order = await this.orderRepository.findByPk(id, {
        include: { all: true },
      });
      if (!order) {
        throw new NotFoundException('Order topilmadi!');
      }

      order = (await this.setProducts([order]))[0];

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
      let orders = await this.orderRepository.findAll({
        where: { client_id },
        include: { all: true },
      });

      orders = await this.setProducts(orders);

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

  async pagination(page: number, limit: number): Promise<object> {
    try {
      const offset = (page - 1) * limit;
      const orders = await this.orderRepository.findAll({
        include: { all: true },
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

  async update(id: number, orderData: UpdateOrderDto): Promise<object> {
    try {
      await this.findById(id);

      if (orderData.totalAmount) {
        throw new BadRequestException(
          "Umumiy mablag'ni ozgartirish mumkin emas!",
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
              `${real_product.name} mahsulot miqdori yetarli emas!`,
            );
          }
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
        message: 'Buyurtma tahrirlandi',
        data: {
          order,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async setProducts(orders: Order[]): Promise<Order[]> {
    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].items.length; j++) {
        const productResponse: any = await this.productService.getById(
          orders[i].items[j].product_id,
        );
        const product = productResponse?.data?.product ?? {};

        orders[i].items[j] = Object.assign(orders[i].items[j], {
          product,
        });
      }
    }
    return orders;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<void> {
    try {
      await this.findById(id);
      await this.orderRepository.update({ status }, { where: { id } });
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

  async searchForSalesman(
    salesman_id: string,
    page: number,
    order_id?: number,
    status?: string,
    date?: string,
  ): Promise<object> {
    try {
      const page_limit = 10;
      const startIndex = (page - 1) * page_limit;
      const endIndex = page * page_limit;
      const availableOrders = [];
      let findOptions: WhereOptions<Order> = {};

      if (order_id) {
        findOptions = { ...findOptions, id: order_id };
      }
      if (status) {
        findOptions = { ...findOptions, status };
      }
      if (date) {
        findOptions = {
          ...findOptions,
          createdAt: {
            [Op.gte]: literal(`'${date}'::date`),
            [Op.lt]: literal(`'${date}'::date + 1`),
          },
        };
      }

      const orders = await this.orderRepository.findAll({
        where: findOptions,
        include: { all: true },
      });

      const products = await this.productService.findByOptions({
        where: { salesman_id },
        raw: true,
      });

      if (products.length > 0) {
        const product_ids = products.map((product) => product.id);
        for (let i = 0; i < orders.length; i++) {
          const items = orders[i].items;
          const availableProducts = [];
          let salesmanProductsAmount = 0;

          const salesman_products = items.filter((item) =>
            product_ids.includes(item.product_id),
          );
          if (salesman_products.length > 0) {
            for (let j = 0; j < salesman_products.length; j++) {
              const product_detail = products.find(
                (p) => p.id === salesman_products[j].product_id,
              );
              availableProducts.push({
                ...product_detail,
                how_many: salesman_products[j].quantity,
              });

              salesmanProductsAmount +=
                product_detail.price * salesman_products[j].quantity;
            }
          }

          if (availableProducts.length > 0) {
            availableOrders.push({
              id: orders[i].id,
              totalAmount: salesmanProductsAmount,
              products: availableProducts,
              createdAt: orders[i].createdAt,
              status: orders[i].status,
            });
          }
        }
      }
      const total_count = availableOrders.length;
      const total_pages = Math.ceil(total_count / page_limit);

      const response = {
        status: HttpStatus.OK,
        data: {
          records: availableOrders.slice(startIndex, endIndex),
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
}
