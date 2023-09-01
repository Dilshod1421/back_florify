import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from '../../product/models/product.model';

interface ImageAttrs {
  id: string;
  image: string;
  product_id: number;
}

@Table({ tableName: 'image' })
export class Image extends Model<Image, ImageAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
  })
  product_id: number;

  @BelongsTo(() => Product)
  product: Product;
}
