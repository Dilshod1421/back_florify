import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    example: 'Bucket',
    description: 'The name of the Category',
  })
  @IsNotEmpty()
  @IsString()
  uz: string;

  @ApiProperty({
    example: 'Bucket',
    description: 'The name of the Category',
  })
  @IsNotEmpty()
  @IsString()
  ru: string;

  @ApiProperty({
    example: 'Bucket',
    description: 'The name of the Category',
  })
  @IsNotEmpty()
  @IsString()
  en: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Category',
  })
  uz_description: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Category',
  })
  ru_description: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Category',
  })
  en_description: string;
}
