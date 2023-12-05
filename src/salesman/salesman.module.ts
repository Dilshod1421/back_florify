import { Module } from '@nestjs/common';
import { SalesmanService } from './salesman.service';
import { SalesmanController } from './salesman.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Salesman } from './models/salesman.model';
import { FilesModule } from 'src/files/files.module';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [SequelizeModule.forFeature([Salesman]), OtpModule, FilesModule],
  controllers: [SalesmanController],
  providers: [SalesmanService],
  exports: [SalesmanService],
})
export class SalesmanModule {}
