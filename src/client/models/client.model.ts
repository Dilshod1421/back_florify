import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Comment } from 'src/comment/models/comment.model';
import { Like } from 'src/like/models/like.model';

interface ClientAttrs {
  id: string;
  phone: string;
  name: string;
  address: string;
  image: string;
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
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @HasMany(() => Like, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  likes: Like[];

  @HasMany(() => Comment, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  comments: Comment[];
}
