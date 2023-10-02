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
    type: DataType.STRING,
  })
  uz_description: string;

  @Column({
    type: DataType.STRING,
  })
  ru_description: string;

  @Column({
    type: DataType.STRING,
  })
  en_description: string;

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
