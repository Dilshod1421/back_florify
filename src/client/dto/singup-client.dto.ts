import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class SignupClientDto {
  @ApiProperty({
    example: '+998991234567',
    description: 'Phone number client',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '1122',
    description: 'Code for verification',
  })
  @IsNotEmpty()
  @IsString()
  @Length(4)
  code: string;

  @ApiProperty({
    example: 'Otabek',
    description: 'Full name of client',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'Address ofclient',
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}
