import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ProductDto {
  @ApiProperty({
    example: 'Rose',
    description: 'Name of product',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 25,
    description: 'Price of product',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 25,
    description: 'Quantity of product',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    example: 'Some description',
    description: 'Description of product',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Red',
    description: 'Color of product',
  })
  @IsString()
  color?: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'Salesman ID of product',
  })
  @IsNotEmpty()
  @IsString()
  salesman_id: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'Category ID of product',
  })
  @IsNotEmpty()
  @IsString()
  category_id: string;
}
