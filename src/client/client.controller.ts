import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { PhoneDto } from 'src/otp/dto/phone.dto';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';
import { SignupClientDto } from './dto/singup-client.dto';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { UpdateDto } from './dto/update.dto';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperation({ summary: 'Registration a new client' })
  @Post('register')
  register(
    @Body() signupClientDto: SignupClientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.clientService.register(signupClientDto, res);
  }

  @ApiOperation({ summary: 'Login client with send OTP' })
  @Post('login')
  login(@Body() phoneDto: PhoneDto) {
    return this.clientService.login(phoneDto);
  }

  @ApiOperation({ summary: 'Verify login client' })
  @Post('verifyLogin')
  verifyLogin(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.clientService.verifyLogin(verifyOtpDto, res);
  }

  @ApiOperation({ summary: 'Logout client' })
  // @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.clientService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get all clients' })
  // @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.clientService.getAll();
  }

  @ApiOperation({ summary: 'Get client by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.clientService.getById(id);
  }

  @ApiOperation({ summary: 'Pagination clients' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.clientService.pagination(page, limit);
  }

  @ApiOperation({ summary: 'Update profile of client by ID' })
  // @UseGuards(AuthGuard)
  @Patch(':id')
  updateProfile(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    return this.clientService.updateProfile(id, updateDto);
  }

  @ApiOperation({ summary: 'Delete client by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteClient(@Param('id') id: string) {
    return this.clientService.deleteClient(id);
  }
}
