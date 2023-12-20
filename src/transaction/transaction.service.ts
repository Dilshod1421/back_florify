import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction, TransactionStatus } from './models/transaction.model';
import { Repository } from 'sequelize-typescript';
import { Order, OrderStatus } from 'src/orders/models/order.model';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly orderService: OrdersService,
  ) {}

  async create(transactionDto: TransactionDto) {
    try {
      let {id, ...updateTransactionDto} = transactionDto;
      if (id) {
        const exist = await this.findById(id);
        if (exist) {
          // update
          await this.transactionRepository.update(updateTransactionDto, {
            where: { id },
          });
        }
      } else {
        const { id: newId } = await this.transactionRepository.create(updateTransactionDto, {
          returning: true
        });
        id = newId;
      }
      let orderStatus;
      if ( transactionDto.status === TransactionStatus.SUCCESS ) {
        orderStatus = OrderStatus.PAID;
      } else if ( transactionDto.status === TransactionStatus.FAIL ) {
        orderStatus = OrderStatus.CANCELLED;
      }

      await this.orderService.updateStatus(transactionDto.order_id, orderStatus);

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
        include: [Order]
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
