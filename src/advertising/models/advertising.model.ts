import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface AdvertisingAttributes {
  id: string;
  image: string;
  discount: number;
}

@Table({ tableName: 'advertising' })
export class Advertising extends Model<Advertising, AdvertisingAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @Column({
    type: DataType.INTEGER,
  })
  discount: number;
}
