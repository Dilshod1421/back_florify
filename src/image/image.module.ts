import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './models/image.model';
import { Product } from 'src/product/models/product.model';
import { FilesModule } from 'src/files/files.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Image, Product]),
    FilesModule,
    ProductModule,
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
