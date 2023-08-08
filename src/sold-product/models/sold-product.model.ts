import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Salesman } from '../../salesman/models/salesman.model';
import { Product } from '../../product/models/product.model';
import { Client } from 'src/client/models/client.model';

interface SoldProductAttrs {
  id: string;
  product_id: string;
  salesman_id: string;
  client_id: string;
}

@Table({ tableName: 'sold-product' })
export class SoldProduct extends Model<SoldProduct, SoldProductAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
  })
  product_id: string;

  @ForeignKey(() => Salesman)
  @Column({
    type: DataType.UUID,
  })
  salesman_id: string;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
  })
  client_id: string;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Salesman)
  salesman: Salesman;

  @BelongsTo(() => Client)
  client: Client;
}
