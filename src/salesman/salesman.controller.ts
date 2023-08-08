import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SalesmanService } from './salesman.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginSalesmanDto } from './dto/login-salesman.dto';
import { PhoneDto } from 'src/admin/dto/phone.dto';
import { VerifyOtpDto } from 'src/admin/dto/verifyOtp.dto';
import { AddSalesmanDto } from './dto/add-salesman.dto';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { SalesmanDto } from './dto/salesman.dto';
import { NewPasswordDto } from 'src/admin/dto/new-password.dto';
import { ForgotPasswordDto } from 'src/admin/dto/forgot-password.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Salesman')
@Controller('salesman')
export class SalesmanController {
  constructor(private readonly salesmanService: SalesmanService) {}

  @ApiOperation({ summary: 'Send otp to phone number of the salesman' })
  @UseGuards(AuthGuard)
  @Post('sendOtp')
  sendOtp(@Body() phoneDto: PhoneDto) {
    return this.salesmanService.sendOtp(phoneDto);
  }

  @ApiOperation({ summary: 'Verify otp of the salesman' })
  @UseGuards(AuthGuard)
  @Post('verifyOtp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.salesmanService.verifyOtp(verifyOtpDto);
  }

  @ApiOperation({ summary: 'Create new salesman' })
  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() addSalesmanDto: AddSalesmanDto) {
    return this.salesmanService.create(addSalesmanDto);
  }

  @ApiOperation({ summary: 'Log in salesman' })
  @Post('login')
  login(
    @Body() loginSalesmanDto: LoginSalesmanDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.salesmanService.login(loginSalesmanDto, res);
  }

  @ApiOperation({ summary: 'Log out salesman' })
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.salesmanService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get all salesmans' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.salesmanService.findAll();
  }

  @ApiOperation({ summary: 'Pagination salesmans' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.salesmanService.paginate(page);
  }

  @ApiOperation({ summary: 'Get salesman by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesmanService.findById(id);
  }

  @ApiOperation({ summary: 'New password of the salesman' })
  @UseGuards(AuthGuard)
  @Patch('newPassword')
  newPassword(@Param('id') id: string, newPasswordDto: NewPasswordDto) {
    return this.salesmanService.newPassword(id, newPasswordDto);
  }

  @ApiOperation({ summary: 'Forgot password salesman' })
  @UseGuards(AuthGuard)
  @Patch('forgotPassword')
  forgotPassword(
    @Param('id') id: string,
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.salesmanService.forgotPassword(id, forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Update salesman by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() salesmanDto: SalesmanDto) {
    return this.salesmanService.update(id, salesmanDto);
  }

  @ApiOperation({ summary: 'Delete Salesman by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesmanService.remove(id);
  }
}
