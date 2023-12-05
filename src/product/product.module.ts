import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { SalesmanModule } from 'src/salesman/salesman.module';
import { CategoryModule } from 'src/category/category.module';
import { Image } from 'src/image/models/image.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, Image]),
    SalesmanModule,
    CategoryModule,
    FilesModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
