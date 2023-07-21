import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({
    example: 'Cambridge',
    description: 'The username of the Admin',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    example: 'john@gmail.com',
    description: 'The email of the Admin',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the Admin',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
