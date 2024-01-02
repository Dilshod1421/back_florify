import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from 'src/product/models/product.model';

interface WatchedAttributes {
  id: string;
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

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;
}
