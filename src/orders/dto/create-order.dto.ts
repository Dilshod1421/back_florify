import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../models/order.model';

export class CreateOrderItemDto {
  @ApiProperty({
    example: '1',
    description: 'ID of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({
    example: 3,
    description: 'Quantity of product',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
    description: 'ID of the client',
  })
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @ApiProperty({
    example: [{ product_id: 1, quantity: 3 }],
    description: 'Products to be purchased',
    isArray: true,
    type: CreateOrderItemDto,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  status: OrderStatus;
  totalAmount: number;
}
