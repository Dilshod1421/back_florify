import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    example: 'Good job',
    description: 'Comment of product',
  })
  text: string;
}
