import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface AdminAttributes {
  id: string;
  phone: string;
  hashed_password: string;
  email: string;
  username: string;
}

@Table({ tableName: 'admin' })
export class Admin extends Model<Admin, AdminAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  username: string;
}
