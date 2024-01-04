import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction, TransactionStatus } from './models/transaction.model';
import { Repository } from 'sequelize-typescript';
import { Order, OrderStatus } from 'src/orders/models/order.model';
import { OrdersService } from 'src/orders/orders.service';
import { orderCompleteSMSSchema, sendSMS } from 'src/utils/sendSMS';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/models/product.model';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly orderService: OrdersService,
    private readonly productService: ProductService,
  ) {}

  async create(transactionDto: TransactionDto) {
    try {
      let { id, ...updateTransactionDto } = transactionDto;
      const orderResponse: any = await this.orderService.findById(
        updateTransactionDto.order_id,
      );
      const order = orderResponse.data.order as Order;
      if (id) {
        const exist = await this.findById(id);
        if (exist) {
          let dto = {};
          if (updateTransactionDto.info) {
            dto = Object.assign(dto, { info: updateTransactionDto.info });
          }
          if (updateTransactionDto.status) {
            dto = Object.assign(dto, { status: updateTransactionDto.status });
          }
          // update
          await this.transactionRepository.update(dto, {
            where: { id },
          });
        }
      } else {
        const { id: newId } = await this.transactionRepository.create(
          updateTransactionDto,
          {
            returning: true,
          },
        );
        id = newId;
      }
      let orderStatus;
      if (transactionDto.status === TransactionStatus.SUCCESS) {
        orderStatus = OrderStatus.PAID;
        await sendSMS(
          order.client.phone,
          orderCompleteSMSSchema(updateTransactionDto.order_id),
        );

        for (let i = 0; i < order.items.length; i++) {
          const item = order.items[i];
          const productResponse: any = await this.productService.getById(
            item.product_id,
          );
          const product = productResponse?.data?.product as Product;
          await this.productService.update(item.product_id, {
            quantity: product.quantity - item.quantity,
          });
        }
      } else if (transactionDto.status === TransactionStatus.FAIL) {
        orderStatus = OrderStatus.CANCELLED;
      }

      await this.orderService.updateStatus(
        transactionDto.order_id,
        orderStatus,
      );

      return await this.findById(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return this.transactionRepository.findAll({
      include: [Order],
    });
  }

  async findById(id: string): Promise<object> {
    try {
      const transaction = await this.transactionRepository.findByPk(id, {
        include: [Order],
      });
      if (!transaction) {
        throw new NotFoundException('Transaction topilmadi!');
      }
      return {
        statusCode: HttpStatus.OK,
        data: {
          transaction,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
