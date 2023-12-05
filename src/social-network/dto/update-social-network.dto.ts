import { ApiProperty } from '@nestjs/swagger';

export class UpdateSocialDto {
  @ApiProperty({
    example: 'Telegram',
    description: 'Name of social network',
  })
  name?: string;

  @ApiProperty({
    example: 'https://t.me/will',
    description: 'Link of social network',
  })
  link?: string;
}
