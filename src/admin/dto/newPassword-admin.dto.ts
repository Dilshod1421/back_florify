import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class NewPasswordAdminDto {
  @ApiProperty({
    example: 'Johndoe1!',
    description: 'The old password of the admin',
  })
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({
    example: 'DoeJohn2!',
    description: 'The new password of the admin',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  new_password: string;

  @ApiProperty({
    example: 'DoeJohn2!',
    description: 'The confirm new password of the admin',
  })
  @IsNotEmpty()
  confirm_new_password: string;
}
