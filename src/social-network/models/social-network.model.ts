import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Salesman } from '../../salesman/models/salesman.model';

interface SocialNetworkAttrs {
  id: string;
  name: string;
  link: string;
  salesman_id: string;
}

@Table({ tableName: 'SocialNetwork' })
export class SocialNetwork extends Model<SocialNetwork, SocialNetworkAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
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
    type: DataType.STRING,
  })
  salesman_id: string;

  @BelongsTo(() => Salesman)
  salesman: Salesman;
}
