import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The old password of the admin',
  })
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({
    example: 'Strong_pass123!',
    description: 'The new strong password of the admin',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  new_password: string;

  @ApiProperty({
    example: 'Strong_pass123!',
    description: 'The confirm new strong password of the admin',
  })
  @IsNotEmpty()
  confirm_new_password: string;
}
