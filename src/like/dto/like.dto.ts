import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikeDto {
  @ApiProperty({
    example: '1',
    description: 'id of product',
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;
}
