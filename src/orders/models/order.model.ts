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

export enum PaymentType {
  ONLINE = 'ONLINE',
  WHEN_DELIVERED = 'WHEN_DELIVERED',
}

@Table({ tableName: 'order' })
export class Order extends Model<Order, CreateOrderDto> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Client)
  @Column({
    type: DataType.UUID,
  })
  client_id: string;

  @BelongsTo(() => Client)
  client: Client;

  @Column({
    type: DataType.JSONB,
  })
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

  @Column({
    type: DataType.STRING,
  })
  to_whom_bouquet: string;

  @Column({
    type: DataType.STRING,
  })
  customer_firstname: string;

  @Column({
    type: DataType.STRING,
  })
  customer_lastname: string;

  @Column({
    type: DataType.STRING,
  })
  customer_phone: string;

  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  receiver_name: string;

  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  receiver_phone: string;

  @Column({
    type: DataType.STRING,
  })
  full_address: string;

  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  comment_for_courier: string;

  @Column({
    type: DataType.STRING,
  })
  delivery_time: string;

  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  postcard_text: string;

  @Column(
    DataType.ENUM({
      values: Object.keys(PaymentType),
    }),
  )
  payment_type: PaymentType;
}
