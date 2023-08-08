import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImageDto {
  @ApiProperty({
    example: 'https://picsum.photos/id/128/200/300',
    description: 'The image url of the Image',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The product ID of the Image',
  })
  @IsNotEmpty()
  @IsString()
  product_id: string;
}
