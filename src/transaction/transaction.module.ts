import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './models/transaction.model';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Transaction]),
    OrdersModule,
    ProductModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
