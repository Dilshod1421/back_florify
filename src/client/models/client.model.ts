import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';

interface ClientAttrs {
  id: string;
  phone: string;
  name: string;
  address: string;
}

@Table({ tableName: 'client' })
export class Client extends Model<Client, ClientAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;
}
