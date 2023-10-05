import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class PhoneDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'The phone number',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
