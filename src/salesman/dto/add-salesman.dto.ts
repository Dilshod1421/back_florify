import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class AddSalesmanDto {
  @ApiProperty({
    example: 'will_smith',
    description: 'The user name of the salesman',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  username: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The password of the salesman',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  password: string;
}
