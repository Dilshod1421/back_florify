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

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The salesman ID of the Social Network',
  })
  @IsNotEmpty()
  @IsString()
  salesman_id: string;
}
