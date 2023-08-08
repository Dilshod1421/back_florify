import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Product } from '../../product/models/product.model';

interface CategoryAttrs {
  id: string;
  name: string;
  description: string;
  image: string;
}

@Table({ tableName: 'category' })
export class Category extends Model<Category, CategoryAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @HasMany(() => Product, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  product: Product[];
}
