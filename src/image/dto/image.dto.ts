import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ImageDto {
  @ApiProperty({
    type: 'string',
    example: 'Rose 4k',
  })
  name?: string;

  @ApiProperty({
    type: 'string',
    example: '1 mb',
  })
  size?: string;

  @ApiProperty({
    type: 'number',
    example: '1',
  })
  @IsNotEmpty()
  product_id: number;
}
