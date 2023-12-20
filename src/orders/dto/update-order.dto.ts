import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderStatus, PaymentType } from '../models/order.model';

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
    required: false,
  })
  @IsOptional()
  @IsString()
  client_id?: string;
  @ApiProperty({ isArray: true, type: UpdateOrderItemDto, required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  items?: UpdateOrderItemDto[];
  // @ApiProperty({
  //   example: OrderStatus.PENDING,
  //   description: 'status of the order',
  //   enum: OrderStatus,
  //   required: false,
  // })
  // @IsOptional()
  // @IsEnum(OrderStatus)
  // status?: OrderStatus;

  @ApiProperty({
    example: 'Я сам',
    description: 'Who is the bouquet for?',
  })
  @IsOptional()
  @IsString()
  to_whom_bouquet?: string;

  @ApiProperty({
    example: 'Obid',
    description: 'firstname of customer',
  })
  @IsOptional()
  @IsString()
  customer_firstname?: string;

  @ApiProperty({
    example: 'Obidov',
    description: 'lastname of customer',
  })
  @IsOptional()
  @IsString()
  customer_lastname?: string;

  @ApiProperty({
    example: '+998907001122',
    description: 'phone of customer',
  })
  @IsOptional()
  @IsString()
  customer_phone?: string;

  @ApiProperty({
    example: 'Uchqun',
    description: 'fullname of recipient',
  })
  @IsOptional()
  @IsString()
  receiver_name?: string;

  @ApiProperty({
    example: '+998907001133',
    description: 'phone of recipient',
  })
  @IsOptional()
  @IsString()
  receiver_phone?: string;

  @ApiProperty({
    example: 'Toshkent sh. Yunusobod t. 6-kvartal 23kv',
    description: 'full address',
  })
  @IsOptional()
  @IsString()
  full_address?: string;

  @ApiProperty({
    example: 'Call me when you receive it',
    description: 'comment for courier',
  })
  @IsOptional()
  @IsString()
  comment_for_courier?: string;

  @ApiProperty({
    example: 'Tomorrow 22:00',
    description: 'delivery time',
  })
  @IsOptional()
  @IsString()
  delivery_time?: string;

  @ApiProperty({
    example: PaymentType.ONLINE,
    description: 'payment type of the order',
  })
  @IsOptional()
  payment_type?: PaymentType;
}