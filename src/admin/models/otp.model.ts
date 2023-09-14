import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface OtpAttributes {
  code: string;
  phone: string;
  expire_time: number;
}

@Table({ tableName: 'otp' })
export class Otp extends Model<Otp, OtpAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  expire_time: number;
}
