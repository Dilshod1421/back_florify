import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Very beautiful flower',
    description: 'Comment of product',
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    example: 3,
    description: 'Rate of product',
  })
  rate: number;

  @ApiProperty({
    example: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
    description: 'ID of the client',
  })
  @IsNotEmpty()
  @IsString()
  client_id: string;

  @ApiProperty({
    example: '1',
    description: 'ID of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;
}
