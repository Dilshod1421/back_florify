import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetByIdDto {
  @ApiProperty({
    type: 'uuid',
    example: 'af2300234jk00-324324jlkj',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({
    type: 'number',
    example: '1',
  })
  page: number;

  @ApiProperty({
    type: 'number',
    example: '10',
  })
  limit: number;
}
