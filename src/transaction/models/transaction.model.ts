import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { TransactionDto } from '../dto/transaction.dto';
import { Order } from 'src/orders/models/order.model';

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

@Table({ tableName: 'transaction' })
export class Transaction extends Model<Transaction, TransactionDto> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
  })
  order_id: string;

  @BelongsTo(() => Order)
  order: Order;

  @Column({ type: DataType.JSON })
  info: Object;

  @Column(
    DataType.ENUM({
      values: Object.keys(TransactionStatus),
    }),
  )
  status: TransactionStatus;

  @Column({
    type: DataType.INTEGER,
  })
  amount: number;

  @Column({ type: DataType.STRING })
  currency: string;
}
