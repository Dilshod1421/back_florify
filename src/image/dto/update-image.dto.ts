import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateImageDto {
  @ApiProperty({
    example: 'https://picsum.photos/id/128/200/300',
    description: 'The image url of the Image',
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}
