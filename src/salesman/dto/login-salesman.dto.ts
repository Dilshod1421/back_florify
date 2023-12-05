import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginSalesmanDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number of salesman',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'will8990',
    description: 'Password of salesman',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}
