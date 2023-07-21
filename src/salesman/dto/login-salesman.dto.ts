import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginSalesmanDto {
  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the Salesman',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The password of the Salesman',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
