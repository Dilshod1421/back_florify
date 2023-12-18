import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { OrderStatus } from '../models/order.model';

class UpdateOrderItemDto {
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

export class UpdateOrderDto {
  @ApiProperty({
    example: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
    description: 'ID of the order',
  })
  @IsNotEmpty()
  @IsString()
  client_id?: string;
  @ApiProperty({ isArray: true, type: UpdateOrderItemDto })
  items?: UpdateOrderItemDto[];
  @ApiProperty({
    example: OrderStatus.PENDING,
    description: 'status of the order',
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
