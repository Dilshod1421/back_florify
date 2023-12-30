import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    example: 'Good job',
    description: 'Comment of product',
  })
  text?: string;

  @ApiProperty({
    example: 3,
    description: 'Rate of product',
  })
  rate?: number;
}
