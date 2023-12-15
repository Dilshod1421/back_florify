import { Module } from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import { AdvertisingController } from './advertising.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Advertising } from './models/advertising.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [SequelizeModule.forFeature([Advertising]), FilesModule],
  controllers: [AdvertisingController],
  providers: [AdvertisingService],
})
export class AdvertisingModule {}
