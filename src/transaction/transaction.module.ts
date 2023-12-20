import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './models/transaction.model';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [SequelizeModule.forFeature([Transaction]), OrdersModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
