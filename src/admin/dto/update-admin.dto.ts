import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty({
    example: '+998990010101',
    description: 'The new phone number of the admin',
  })
  phone?: string;

  @ApiProperty({
    example: 'alisherov@gmail.com',
    description: 'The new email address of the admin',
  })
  email?: string;

  @ApiProperty({
    example: 'alisherov_admin',
    description: 'The new username of the admin',
  })
  username?: string;
}
