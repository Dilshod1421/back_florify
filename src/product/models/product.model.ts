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
import { Image } from 'src/image/models/image.model';
import { Like } from 'src/like/models/like.model';
import { Comment } from 'src/comment/models/comment.model';
import { Order } from 'src/orders/models/order.model';

interface ProductAttributes {
  name: string;
  price: number;
  quantity: number;
  description: string;
  color: string;
  date: string;
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
  description: string;

  @Column({
    type: DataType.STRING,
  })
  color: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  date: string;

  @ForeignKey(() => Salesman)
  @Column({
    type: DataType.UUID,
  })
  salesman_id: string;

  @BelongsTo(() => Salesman)
  salesman: Salesman;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
  })
  category_id: string;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => Image, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  images: Image[];

  @HasMany(() => Like, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  likes: Like[];

  @HasMany(() => Comment, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  comments: Comment[];

  @HasMany(() => Order, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  orders: Order[];
}
