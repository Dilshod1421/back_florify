import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'The phone number of the admin',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '230811',
    description: 'OTP code',
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}
