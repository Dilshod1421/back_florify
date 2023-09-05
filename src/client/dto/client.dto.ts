import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ClientDto {
  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the client',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'Tom Holland',
    description: 'The full name of the client',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'The address of the client',
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}
