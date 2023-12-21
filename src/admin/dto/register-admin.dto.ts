import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({
    example: 'very secret key',
    description: 'The secret key of the admin',
  })
  @IsNotEmpty()
  @IsString()
  secret_key: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'The phone number of the admin (not required)',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The strong password of the admin',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'otabek@gmail.com',
    description: 'The email address of the admin',
  })
  email?: string;

  @ApiProperty({
    example: 'otabek_admin',
    description: 'The username of the admin (not required)',
  })
  username?: string;
}
