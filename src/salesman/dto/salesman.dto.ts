import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SalesmanDto {
  @ApiProperty({
    example: 'Will Smith',
    description: 'The full name of the salesman',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the salesman',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'The address of the salesman',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: 'https://picsum.photos/id/128/200/300',
    description: 'The image url of the salesman',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    example: 'will@gmail.com',
    description: 'The email of the salesman',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
