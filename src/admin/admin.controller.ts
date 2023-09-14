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
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Response } from 'express';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { PhoneDto } from './dto/phone.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Send OTP to phone number for register' })
  @Post('sendOtp')
  sendOtp(@Body() phoneDto: PhoneDto) {
    return this.adminService.sendSMS(phoneDto);
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @Post('verifyOtp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.adminService.verifyOtp(verifyOtpDto);
  }

  @ApiOperation({ summary: 'Registration a new admin' })
  @Post('register')
  register(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.register(createAdminDto);
  }

  @ApiOperation({ summary: 'Log in admin' })
  @Post('login')
  login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.login(loginAdminDto, res);
  }

  @ApiOperation({ summary: 'Log out admin' })
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get all admins' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @ApiOperation({ summary: 'Pagination admins' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.adminService.paginate(page);
  }

  @ApiOperation({ summary: 'Get admin by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.adminService.findById(id);
  }

  @ApiOperation({ summary: 'New password of the admin' })
  @UseGuards(AuthGuard)
  @Patch('newPassword/:id')
  newPassword(@Param('id') id: string, @Body() newPasswordDto: NewPasswordDto) {
    return this.adminService.newPassword(id, newPasswordDto);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @UseGuards(AuthGuard)
  @Patch('forgotPassword/:id')
  forgotPassword(
    @Param('id') id: string,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.adminService.forgotPassword(id, forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Update admin by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @ApiOperation({ summary: 'Delete admin by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
