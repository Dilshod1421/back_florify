import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    example: '+998901234567, john@gmail.com, admin',
    description: 'The phone number(email or username) of the admin',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The password of the admin',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
