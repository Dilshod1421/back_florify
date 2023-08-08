import { Module } from '@nestjs/common';
import { SalesmanService } from './salesman.service';
import { SalesmanController } from './salesman.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Salesman } from './models/salesman.model';
import { Otp } from 'src/admin/models/otp.model';

@Module({
  imports: [SequelizeModule.forFeature([Salesman, Otp])],
  controllers: [SalesmanController],
  providers: [SalesmanService],
})
export class SalesmanModule {}
