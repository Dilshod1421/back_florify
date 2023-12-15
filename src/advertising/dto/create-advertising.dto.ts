import { ApiProperty } from '@nestjs/swagger';

export class CreateAdvertisingDto {
  @ApiProperty({
    example: 30,
    description: 'Discount of advertising',
  })
  discount: number;
}
