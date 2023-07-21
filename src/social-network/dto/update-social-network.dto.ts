import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateSocialNetworkDto {
  @ApiProperty({
    example: 'Telegram',
    description: 'The name of the Social Network',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'https://t.me/will',
    description: 'The link of the Social Network',
  })
  @IsOptional()
  @IsUrl()
  link?: string;
}
