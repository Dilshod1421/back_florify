import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WatchedDto {
  @ApiProperty({
    example: 'adsf12300j2-adf23',
    description: 'id of client',
  })
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @ApiProperty({
    example: '1',
    description: 'id of product',
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;
}
