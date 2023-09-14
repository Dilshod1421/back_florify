import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SocialNetworkDto {
  @ApiProperty({
    example: 'Telegram',
    description: 'The name of the Social Network',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://t.me/will',
    description: 'The link of the Social Network',
  })
  @IsNotEmpty()
  @IsUrl()
  link: string;
}
