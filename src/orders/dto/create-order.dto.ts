import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

  @ApiProperty({
    example: 'Я сам',
    description: 'Who is the bouquet for?',
  })
  @IsNotEmpty()
  @IsString()
  to_whom_bouquet: string;

  @ApiProperty({
    example: 'Obid',
    description: 'firstname of customer',
  })
  @IsNotEmpty()
  @IsString()
  customer_firstname: string;

  @ApiProperty({
    example: 'Obidov',
    description: 'lastname of customer',
  })
  @IsNotEmpty()
  @IsString()
  customer_lastname: string;

  @ApiProperty({
    example: '+998907001122',
    description: 'phone of customer',
  })
  @IsNotEmpty()
  @IsString()
  customer_phone: string;

  @ApiProperty({
    example: 'Uchqun',
    description: 'fullname of recipient',
    required: false,
  })
  @IsOptional()
  @IsString()
  receiver_name: string;

  @ApiProperty({
    example: '+998907001133',
    description: 'phone of recipient',
    required: false,
  })
  @IsOptional()
  @IsString()
  receiver_phone: string;

  @ApiProperty({
    example: 'Toshkent sh. Yunusobod t. 6-kvartal 23kv',
    description: 'full address',
  })
  @IsNotEmpty()
  @IsString()
  full_address: string;

  @ApiProperty({
    example: 'Call me when you receive it',
    description: 'comment for courier',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment_for_courier: string;

  @ApiProperty({
    example: 'Tomorrow 22:00',
    description: 'delivery time',
  })
  @IsNotEmpty()
  @IsString()
  delivery_time: string;

  @ApiProperty({
    example: PaymentType.ONLINE,
    description: 'status of the order',
    enum: PaymentType,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(PaymentType)
  payment_type: PaymentType;
}
