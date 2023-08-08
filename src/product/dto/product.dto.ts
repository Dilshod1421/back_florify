import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ProductDto {
  @ApiProperty({
    example: 'Rose',
    description: 'The name of the product',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the product',
  })
  description: string;

  @ApiProperty({
    example: 25,
    description: 'The price of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 25,
    description: 'The price of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    example: 'Red',
    description: 'The color of the product',
  })
  color: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The salesman ID of the product',
  })
  @IsNotEmpty()
  @IsString()
  salesman_id: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The category ID of the product',
  })
  @IsNotEmpty()
  @IsString()
  category_id: string;
}
