import { ApiProperty } from '@nestjs/swagger';

export class UpdateSalesmanDto {
  @ApiProperty({
    example: '+998991234567',
    description: 'Phone number of salesman',
  })
  phone?: string;

  @ApiProperty({
    example: 'florify',
    description: 'Username of salesman',
  })
  username?: string;

  @ApiProperty({
    example: "Parkentskiy ko'chasi, 14",
    description: 'Address of salesman',
  })
  address?: string;

  @ApiProperty({
    example: 'user123',
    description: 'Telegram username of salesman',
  })
  telegram?: string;
}
