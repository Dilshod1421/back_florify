import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { ClientModule } from 'src/client/client.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [SequelizeModule.forFeature([Comment]), ClientModule, ProductModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
