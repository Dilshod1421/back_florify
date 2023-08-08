import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SoldProductDto {
  @ApiProperty({
    example: '2',
    description: 'How many of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  how_many: number;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The product ID of the Sold Product',
  })
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The salesman ID of the Sold Product',
  })
  @IsNotEmpty()
  @IsString()
  salesman_id: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The cart ID of the Sold Product',
  })
  @IsNotEmpty()
  @IsString()
  client_id: string;
}
