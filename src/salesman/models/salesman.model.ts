import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Product } from '../../product/models/product.model';
import { SoldProduct } from '../../sold-product/models/sold-product.model';

interface SalesmanAttributes {
  id: string;
  phone: string;
  hashed_password: string;
  username: string;
  telegram: string;
  image: string;
  address: string;
  store_phone: string;
  store_address: string;
}

@Table({ tableName: 'salesman' })
export class Salesman extends Model<Salesman, SalesmanAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  telegram: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  store_phone: string;

  @Column({
    type: DataType.STRING,
  })
  store_address: string;

  @HasMany(() => Product, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  product: Product[];

  @HasMany(() => SoldProduct, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  sold_product: SoldProduct[];
}
