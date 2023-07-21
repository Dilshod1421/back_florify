import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Cart } from '../../cart/models/cart.model';
import { Salesman } from '../../salesman/models/salesman.model';
import { Product } from '../../product/models/product.model';

interface SoldProductAttrs {
  id: string;
  product_id: string;
  cart_id: string;
  salesman_id: string;
}

@Table({ tableName: 'sold-product' })
export class SoldProduct extends Model<SoldProduct, SoldProductAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
  })
  product_id: string;

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.STRING,
  })
  cart_id: string;

  @ForeignKey(() => Salesman)
  @Column({
    type: DataType.STRING,
  })
  salesman_id: string;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Cart)
  cart: Cart;

  @BelongsTo(() => Salesman)
  salesman: Salesman;
}
