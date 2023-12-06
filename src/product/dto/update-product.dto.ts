import { ApiProperty } from '@nestjs/swagger';

export class UpdateProducDto {
  @ApiProperty({
    example: 'Rose',
    description: 'Name of product',
  })
  name?: string;

  @ApiProperty({
    example: 25,
    description: 'Price of product',
  })
  price?: number;

  @ApiProperty({
    example: 25,
    description: 'Quantity of product',
  })
  quantity?: number;

  @ApiProperty({
    example: 'Some description',
    description: 'Description of product',
  })
  description?: string;

  @ApiProperty({
    example: 'Red',
    description: 'Color of product',
  })
  color?: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'Salesman ID of product',
  })
  salesman_id?: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'Category ID of product',
  })
  category_id?: string;
}
