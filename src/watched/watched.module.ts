import { Module } from '@nestjs/common';
import { WatchedService } from './watched.service';
import { WatchedController } from './watched.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Watched } from './models/watched.model';

@Module({
  imports: [SequelizeModule.forFeature([Watched])],
  controllers: [WatchedController],
  providers: [WatchedService],
  exports: [WatchedService],
})
export class WatchedModule {}
