import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsStrongPassword } from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({
    example: '+998991234567',
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