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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAdminDto } from './dto/login-admin.dto';
import { Admin } from './models/admin.models';
import { NewPasswordAdminDto } from './dto/newPassword-admin.dto';
import { PhoneAdminDto } from './dto/phone-admin.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Response } from 'express';
import { VerifyOtpDto } from './dto/verifyOtp.dto';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { SetNewPassDto } from './dto/setNewPass.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Send OTP to phone number for register' })
  @Post('sendOtp')
  async sendOtp(@Body() phoneAdminDto: PhoneAdminDto) {
    return this.adminService.sendOtp(phoneAdminDto);
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @Post('verifyOtp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.adminService.verifyOtp(verifyOtpDto);
  }

  @ApiOperation({ summary: 'Registration a new admin' })
  @Post('register')
  async register(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.register(createAdminDto);
  }

  @ApiOperation({ summary: 'Log in admin' })
  @Post('login')
  async login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.login(loginAdminDto, res);
  }

  @ApiOperation({ summary: 'Log out admin' })
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get all admins' })
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  @ApiOperation({ summary: 'Get admin by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.adminService.findById(id);
  }

  @ApiOperation({ summary: 'New password of the admin' })
  @UseGuards(AuthGuard)
  @Patch('newPassword/:id')
  async newPassword(
    @Param('id') id: string,
    @Body() newPasswordAdminDto: NewPasswordAdminDto,
  ) {
    return this.adminService.newPassword(id, newPasswordAdminDto);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @UseGuards(AuthGuard)
  @Patch('forgotPassword/:id')
  async forgotPassword(
    @Param('id') id: string,
    @Body() setNewPassDto: SetNewPassDto,
  ) {
    return this.adminService.forgotPassword(id, setNewPassDto);
  }

  @ApiOperation({ summary: 'Update admin by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @ApiOperation({ summary: 'Delete admin by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
