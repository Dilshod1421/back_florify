import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({
    example: 'myverysecretkey',
    description: 'The secret key for creating the admin',
  })
  @IsNotEmpty()
  @IsString()
  secret_key: string;

  @ApiProperty({
    example: 'otabek@gmail.com',
    description: 'The email address of the admin',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The strong password of the admin',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the admin (not required)',
  })
  phone?: string;

  @ApiProperty({
    example: 'otabek_admin',
    description: 'The username of the admin (not required)',
  })
  username?: string;
}
