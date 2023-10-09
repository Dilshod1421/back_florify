import { Module } from '@nestjs/common';
import { WatchedService } from './watched.service';
import { WatchedController } from './watched.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Watched } from './models/watched.model';
import { ClientModule } from 'src/client/client.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [SequelizeModule.forFeature([Watched]), ClientModule, ProductModule],
  controllers: [WatchedController],
  providers: [WatchedService],
})
export class WatchedModule {}
