import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateClientDto {
  @ApiProperty({
    example: 'Tom Holland',
    description: 'The full name of the Client',
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'The address of the Client',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the Client',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
