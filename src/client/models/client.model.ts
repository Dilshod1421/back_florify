import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Like } from 'src/like/models/like.model';

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
    allowNull: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @HasMany(() => Like, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  like: Like[];
}
