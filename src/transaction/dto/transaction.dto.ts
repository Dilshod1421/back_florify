import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsObject,
  IsOptional,
} from 'class-validator';
import { TransactionStatus } from '../models/transaction.model';

export class TransactionDto {
  @ApiProperty({
    example: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
    description: 'Transaction id to update the transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    example: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
    description: 'ID of the order',
  })
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @ApiProperty({
    example: 10000,
    description: 'payment amount',
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'UZS',
    description: 'payment currency',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    example: { email: 'example@gmail.com', data: { myProp: 'myProp' } },
    description: 'additional info object for transaction',
  })
  @IsNotEmpty()
  @IsObject()
  info: object;

  @ApiProperty({
    example: TransactionStatus.SUCCESS,
    description: 'status of the transaction',
    enum: TransactionStatus,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
