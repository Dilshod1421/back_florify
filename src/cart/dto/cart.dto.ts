import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CartDto {
  @ApiProperty({
    example: '75442486-0878-440c-9db1-a7006c25a39f',
    description: 'ID of client',
  })
  @IsNotEmpty()
  @IsUUID()
  client_id: string;

  @ApiProperty({
    example: '1',
    description: 'ID of product',
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;
}
