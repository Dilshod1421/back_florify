import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Like } from './models/like.model';
import { ProductModule } from 'src/product/product.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [SequelizeModule.forFeature([Like]), ClientModule, ProductModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
