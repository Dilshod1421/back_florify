import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Rose',
    description: 'The name of the Product',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Product',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 25,
    description: 'The price of the Product',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    example: 'Red',
    description: 'The color of the Product',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The category ID of the Product',
  })
  @IsOptional()
  @IsString()
  category_id?: string;
}
