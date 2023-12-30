import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Client } from 'src/client/models/client.model';
import { Product } from 'src/product/models/product.model';

interface CommentAttributes {
  id: string;
  text: string;
  rate: number;
  client_id: string;
  product_id: number;
}

@Table({ tableName: 'comment' })
export class Comment extends Model<Comment, CommentAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
  })
  text: string;

  @Column({
    type: DataType.INTEGER,
  })
  rate: number;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
  })
  client_id: string;

  @BelongsTo(() => Client)
  client: Client;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;
}
