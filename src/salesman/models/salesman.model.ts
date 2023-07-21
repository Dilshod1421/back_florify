import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { SocialNetwork } from '../../social-network/models/social-network.model';
import { Product } from '../../product/models/product.model';
import { SoldProduct } from '../../sold-product/models/sold-product.model';

interface SalesmanAttrs {
  id: string;
  full_name: string;
  brand: string;
  address: string;
  image_url: string;
  email: string;
  phone: string;
  hashed_password: string;
}

@Table({ tableName: 'salesman' })
export class Salesman extends Model<Salesman, SalesmanAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
  })
  brand: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  image_url: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @HasMany(() => SocialNetwork)
  socialNetwork: SocialNetwork[];

  @HasMany(() => Product)
  product: Product[];

  @HasMany(() => SoldProduct)
  soldProduct: SoldProduct[];
}
