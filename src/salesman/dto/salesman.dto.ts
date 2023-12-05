import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class SalesmanDto {
  @ApiProperty({
    example: '+998991234567',
    description: 'Phone number of salesman',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'Florify123!',
    description: 'Password of salesman',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

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
