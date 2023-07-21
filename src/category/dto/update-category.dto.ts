import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Bucket',
    description: 'The name of the Category',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Category',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://picsum.photos/id/128/200/300',
    description: 'The image url of the Category',
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}
