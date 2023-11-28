import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    example: 'otagek@gmail.com (+998901234567, otabek_admin)',
    description: 'Login for admin (email or phone number or username)',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The strong password of the admin',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
