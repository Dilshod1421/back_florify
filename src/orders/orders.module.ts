import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { ProductModule } from 'src/product/product.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [SequelizeModule.forFeature([Order]), ClientModule, ProductModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
