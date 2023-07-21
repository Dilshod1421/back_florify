import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Bucket',
    description: 'The name of the Category',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Category',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'https://picsum.photos/id/128/200/300',
    description: 'The image url of the Category',
  })
  @IsNotEmpty()
  @IsString()
  image_url: string;
}
