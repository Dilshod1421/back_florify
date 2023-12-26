import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin.models';
import { OtpModule } from 'src/otp/otp.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [SequelizeModule.forFeature([Admin]), OtpModule, OrdersModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
