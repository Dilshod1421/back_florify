import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Product } from '../../product/models/product.model';

interface CategoryAttrs {
  id: string;
  uz: string;
  ru: string;
  en: string;
  uz_description: string;
  ru_description: string;
  en_description: string;
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
    unique: true,
  })
  uz: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  ru: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  en: string;

  @Column({
    type: DataType.TEXT,
  })
  uz_description: string;

  @Column({
    type: DataType.TEXT,
  })
  ru_description: string;

  @Column({
    type: DataType.TEXT,
  })
  en_description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @HasMany(() => Product, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  product: Product[];
}
