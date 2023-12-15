import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdvertisingDto {
  @ApiProperty({
    example: 30,
    description: 'Discount of advertising',
  })
  discount?: number;
}
