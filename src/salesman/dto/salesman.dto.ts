import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SalesmanDto {
  @ApiProperty({
    example: 'florago',
    description: 'The username of the salesman',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the salesman',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: "Parkentskiy ko'chasi, 14",
    description: "Address of salesman",
  })
  address?: string;

  @ApiProperty({
    example: "user123",
    description: "Telegram username of salesman",
  })
  telegram?: string;
}
