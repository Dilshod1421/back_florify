import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Buket',
    description: 'UZ name of category',
  })
  uz?: string;

  @ApiProperty({
    example: 'Букет',
    description: 'RU name of category',
  })
  ru?: string;

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
}
