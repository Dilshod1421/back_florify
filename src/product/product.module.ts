import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { CategoryModule } from '../category/category.module';
import { SalesmanModule } from '../salesman/salesman.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    forwardRef(() => CategoryModule),
    forwardRef(() => SalesmanModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
