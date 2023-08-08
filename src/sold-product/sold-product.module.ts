import { Module } from '@nestjs/common';
import { SoldProductService } from './sold-product.service';
import { SoldProductController } from './sold-product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SoldProduct } from './models/sold-product.model';
import { Product } from 'src/product/models/product.model';

@Module({
  imports: [SequelizeModule.forFeature([SoldProduct, Product])],
  controllers: [SoldProductController],
  providers: [SoldProductService],
})
export class SoldProductModule {}
