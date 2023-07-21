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
  image_url: string;
  product_id: string;
}

@Table({ tableName: 'image' })
export class Image extends Model<Image, ImageAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  image_url: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
  })
  product_id: string;

  @BelongsTo(() => Product)
  product: Product;
}
