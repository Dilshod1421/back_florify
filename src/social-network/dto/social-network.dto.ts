import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SocialNetworkDto {
  @ApiProperty({
    example: 'Telegram',
    description: 'Name of social network',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://t.me/will',
    description: 'Link of social network',
  })
  @IsNotEmpty()
  @IsUrl()
  link: string;
}
