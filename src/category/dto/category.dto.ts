import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    example: 'Buket',
    description: 'UZ name of category',
  })
  @IsNotEmpty()
  @IsString()
  uz: string;

  @ApiProperty({
    example: 'Букет',
    description: 'RU name of category',
  })
  @IsNotEmpty()
  @IsString()
  ru: string;

  @ApiProperty({
    example: 'Bouquet',
    description: 'EN name of category',
  })
  @IsNotEmpty()
  @IsString()
  en: string;

  @ApiProperty({
    example: 'Buketdagi gullar',
    description: 'UZ description of category',
  })
  uz_description?: string;

  @ApiProperty({
    example: 'Цветы в букете',
    description: 'RU description of category',
  })
  ru_description?: string;

  @ApiProperty({
    example: 'Flowers in a bouquet',
    description: 'EN description of category',
  })
  en_description?: string;
}
