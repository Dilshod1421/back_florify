import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateSalesmanDto {
  @ApiProperty({
    example: 'Will Smith',
    description: 'The full name of the Salesman',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: 'Flowers store',
    description: 'The brand of the Salesman',
  })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'The address of the Salesman',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: 'https://picsum.photos/id/128/200/300',
    description: 'The image url of the Salesman',
  })
  @IsNotEmpty()
  @IsString()
  image_url: string;

  @ApiProperty({
    example: 'will@gmail.com',
    description: 'The email of the Salesman',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

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
