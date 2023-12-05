import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
  @ApiProperty({
    example: '+998991234567',
    description: 'Phone number client',
  })
  phone?: string;

  @ApiProperty({
    example: 'Otabek',
    description: 'Full name of client',
  })
  name?: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'Address ofclient',
  })
  address?: string;
}
