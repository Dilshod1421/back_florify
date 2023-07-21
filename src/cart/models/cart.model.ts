import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Client } from './../../client/models/client.model';
import { SoldProduct } from '../../sold-product/models/sold-product.model';

interface CartAttrs {
  id: string;
  client_id: string;
}

@Table({ tableName: 'cart' })
export class Cart extends Model<Cart, CartAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.STRING,
  })
  client_id: string;

  @BelongsTo(() => Client)
  client: Client;

  @HasMany(() => SoldProduct)
  soldProduct: SoldProduct[];
}
