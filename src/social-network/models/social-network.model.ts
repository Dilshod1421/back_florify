import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Salesman } from '../../salesman/models/salesman.model';

interface SocialNetworkAttributes {
  id: string;
  name: string;
  link: string;
  salesman_id: string;
}

@Table({ tableName: 'SocialNetwork' })
export class SocialNetwork extends Model<
  SocialNetwork,
  SocialNetworkAttributes
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  link: string;

  @ForeignKey(() => Salesman)
  @Column({
    type: DataType.UUID,
  })
  salesman_id: string;

  @BelongsTo(() => Salesman)
  salesman: Salesman;
}
