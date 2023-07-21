import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Rose',
    description: 'The name of the Product',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Product',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 25,
    description: 'The price of the Product',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'Red',
    description: 'The color of the Product',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The category ID of the Product',
  })
  @IsNotEmpty()
  @IsString()
  category_id: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The salesman ID of the Product',
  })
  @IsNotEmpty()
  @IsString()
  salesman_id: string;
}
