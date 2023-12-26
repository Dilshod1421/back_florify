import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
  @IsString()
  link: string;
}
