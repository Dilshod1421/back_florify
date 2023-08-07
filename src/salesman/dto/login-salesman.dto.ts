import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginSalesmanDto {
  @ApiProperty({
    example: 'will_smith',
    description: 'The username of the salesman',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The password of the salesman',
  })
  @IsNotEmpty()
  password: string;
}
