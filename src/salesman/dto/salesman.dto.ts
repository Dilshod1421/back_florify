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
}
