import { Module, forwardRef } from '@nestjs/common';
import { SoldProductService } from './sold-product.service';
import { SoldProductController } from './sold-product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SoldProduct } from './models/sold-product.model';
import { ProductModule } from '../product/product.module';
import { CartModule } from '../cart/cart.module';
import { SalesmanModule } from '../salesman/salesman.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SoldProduct]),
    forwardRef(() => ProductModule),
    forwardRef(() => CartModule),
    forwardRef(() => SalesmanModule),
  ],
  controllers: [SoldProductController],
  providers: [SoldProductService],
  exports: [SoldProductService],
})
export class SoldProductModule {}
