import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { SocialNetwork } from '../../social-network/models/social-network.model';
import { Product } from '../../product/models/product.model';
import { SoldProduct } from '../../sold-product/models/sold-product.model';

interface SalesmanAttributes {
  id: string;
  username: string;
  phone: string;
  telegram: string;
  hashed_password: string;
  image: string;
  hashed_refresh_token: string;
}

@Table({ tableName: 'salesman' })
export class Salesman extends Model<Salesman, SalesmanAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
  })
  telegram: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

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
