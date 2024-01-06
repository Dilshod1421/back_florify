import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WatchedTokenDto {
  @ApiProperty({
    example: 'dkfajdfljsd234234j3j',
    description: 'Token for add product to watched',
  })
  @IsString()
  token?: string;
}
