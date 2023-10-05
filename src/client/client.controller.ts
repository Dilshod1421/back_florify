import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { ClientDto } from './dto/client.dto';
import { VerifyOtpDto } from 'src/admin/dto/verifyOtp.dto';
import { PhoneDto } from 'src/admin/dto/phone.dto';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperation({ summary: 'send sms to client' })
  @Post('sendSMS')
  sendSMS(@Body() phoneDto: PhoneDto) {
    return this.clientService.sendSMS(phoneDto);
  }

  @ApiOperation({ summary: 'login client' })
  @Post('login')
  create(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.clientService.register(verifyOtpDto);
  }

  @ApiOperation({ summary: 'Get all clients' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @ApiOperation({ summary: 'Pagination clients' })
  @UseGuards(AuthGuard)
  @Get()
  paginate(@Query('page') page: number) {
    return this.clientService.paginate(page);
  }

  @ApiOperation({ summary: 'Get client by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.clientService.findById(id);
  }

  @ApiOperation({ summary: 'Update client by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() clientDto: ClientDto) {
    return this.clientService.update(id, clientDto);
  }

  @ApiOperation({ summary: 'Delete client by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
