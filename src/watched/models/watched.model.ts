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

interface WatchedAttributes {
  id: string;
  is_watched: boolean;
  client_id: string;
  product_id: number;
}

@Table({ tableName: 'watched' })
export class Watched extends Model<Watched, WatchedAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_watched: boolean;

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

  @BelongsTo(() => Product)
  product: Product;
}
