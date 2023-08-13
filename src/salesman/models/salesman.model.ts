import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { SocialNetwork } from '../../social-network/models/social-network.model';
import { Product } from '../../product/models/product.model';
import { SoldProduct } from '../../sold-product/models/sold-product.model';

interface SalesmanAttributes {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  image: string;
  email: string;
  hashed_password: string;
  hashed_refresh_token: string;
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
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

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
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @HasMany(() => SocialNetwork, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  social_network: SocialNetwork[];

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
