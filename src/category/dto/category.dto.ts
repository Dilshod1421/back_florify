import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
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
  description: string;

  @ApiProperty({
    example: 'https://picsum.photos/id/128/200/300',
    description: 'The image url of the Category',
  })
  @IsNotEmpty()
  @IsString()
  image: string;
}
