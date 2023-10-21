import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Client } from 'src/client/models/client.model';
import { Product } from 'src/product/models/product.model';

interface CartAttributes {
  id: string;
  client_id: string;
  product_id: number;
}

@Table({ tableName: 'cart' })
export class Cart extends Model<Cart, CartAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
  })
  client_id: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  product_id: number;

  @BelongsTo(() => Client)
  client: Client;

  @BelongsTo(() => Product)
  product: Product;
}
