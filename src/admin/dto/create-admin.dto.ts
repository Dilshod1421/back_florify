import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the admin',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    example: 'john@gmail.com',
    description: 'The email address of the admin',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the admin',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The password of the admin',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'myverysecretkey',
    description: 'The secret key for registration',
  })
  @IsNotEmpty()
  @IsString()
  secret_key: string;
}
