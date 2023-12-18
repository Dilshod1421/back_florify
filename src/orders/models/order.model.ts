import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Client } from 'src/client/models/client.model';
import { CreateOrderDto, CreateOrderItemDto } from '../dto/create-order.dto';

export enum OrderStatus {
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

@Table({ tableName: 'order' })
export class Order extends Model<Order, CreateOrderDto> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
  })
  client_id: string;

  @BelongsTo(() => Client)
  client: Client;

  @Column({ type: DataType.JSONB })
  items: CreateOrderItemDto[];

  @Column(
    DataType.ENUM({
      values: Object.keys(OrderStatus),
    }),
  )
  status: OrderStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  totalAmount: number;
}
