import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Salesman } from '../../salesman/models/salesman.model';
import { Category } from '../../category/models/category.model';
import { Image } from '../../image/models/image.model';
import { SoldProduct } from '../../sold-product/models/sold-product.model';

interface ProductAttrs {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
  category_id: string;
  salesman_id: string;
}

@Table({ tableName: 'product' })
export class Product extends Model<Product, ProductAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
  })
  price: number;

  @Column({
    type: DataType.STRING,
  })
  color: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.STRING,
  })
  category_id: string;

  @ForeignKey(() => Salesman)
  @Column({
    type: DataType.STRING,
  })
  salesman_id: string;

  @BelongsTo(() => Category)
  category: Category;

  @BelongsTo(() => Salesman)
  salesman: Salesman;

  @HasMany(() => Image)
  image: Image[];

  @HasMany(() => SoldProduct)
  soldProduct: SoldProduct[];
}
