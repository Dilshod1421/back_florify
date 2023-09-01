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
import { SoldProduct } from '../../sold-product/models/sold-product.model';
import { Image } from 'src/image/models/image.model';

interface ProductAttributes {
  name: string;
  description: string;
  price: number;
  quantity: number;
  color: string;
  salesman_id: string;
  category_id: string;
}

@Table({ tableName: 'product' })
export class Product extends Model<Product, ProductAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.STRING,
  })
  color: string;

  @ForeignKey(() => Salesman)
  @Column({
    type: DataType.UUID,
  })
  salesman_id: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
  })
  category_id: string;

  @BelongsTo(() => Salesman)
  salesman: Salesman;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => Image, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  image: Image[];

  @HasMany(() => SoldProduct, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  sold_product: SoldProduct[];
}
