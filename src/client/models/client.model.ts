import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Cart } from '../../cart/models/cart.model';

interface ClientAttrs {
  id: string;
  full_name: string;
  address: string;
  phone: string;
}

@Table({ tableName: 'client' })
export class Client extends Model<Client, ClientAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @HasMany(() => Cart)
  cart: Cart[];
}
