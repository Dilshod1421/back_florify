import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'Tom Holland',
    description: 'The full name of the Client',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'The address of the Client',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the Client',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
