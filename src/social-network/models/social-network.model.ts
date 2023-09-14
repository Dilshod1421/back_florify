import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface SocialNetworkAttributes {
  id: string;
  name: string;
  link: string;
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
}
