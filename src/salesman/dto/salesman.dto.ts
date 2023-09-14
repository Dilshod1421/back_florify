import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SalesmanDto {
  @ApiProperty({
    example: 'florago',
    description: 'The username of the salesman',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the salesman',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'will@gmail.com',
    description: 'The telegram username of the salesman',
  })
  @IsNotEmpty()
  @IsString()
  telegram: string;
}
