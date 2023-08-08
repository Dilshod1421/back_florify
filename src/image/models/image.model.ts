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
  product_id: string;
}

@Table({ tableName: 'image' })
export class Image extends Model<Image, ImageAttrs> {
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
  image: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
  })
  product_id: string;

  @BelongsTo(() => Product)
  product: Product;
}
