import { Module } from '@nestjs/common';
import { SalesmanService } from './salesman.service';
import { SalesmanController } from './salesman.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Salesman } from './models/salesman.model';
import { FilesModule } from 'src/files/files.module';
import { Otp } from 'src/otp/models/otp.model';

@Module({
  imports: [SequelizeModule.forFeature([Salesman, Otp]), FilesModule],
  controllers: [SalesmanController],
  providers: [SalesmanService],
})
export class SalesmanModule {}
