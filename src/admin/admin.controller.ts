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
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { NewPasswordDto } from './dto/new-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Registration a new admin' })
  @Post('register')
  register(
    @Body() registerAdminDto: RegisterAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(registerAdminDto);
    return this.adminService.register(registerAdminDto, res);
  }

  @ApiOperation({ summary: 'Login admin with send OTP' })
  @Post('login')
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @ApiOperation({ summary: 'Verify login admin' })
  @Post('verifyLogin')
  verifLogin(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.verifyLogin(verifyOtpDto, res);
  }

  @ApiOperation({ summary: 'Logout admin' })
  // @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get all admins' })
  // @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.adminService.getAll();
  }

  @ApiOperation({ summary: 'Get admin by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.adminService.getById(id);
  }

  @ApiOperation({ summary: 'Get admins with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.adminService.pagination(page, limit);
  }

  @ApiOperation({ summary: 'New password of admin' })
  // @UseGuards(AuthGuard)
  @Patch('newPassword/:id')
  newPassword(@Param('id') id: string, @Body() newPasswordDto: NewPasswordDto) {
    return this.adminService.newPassword(id, newPasswordDto);
  }

  @ApiOperation({ summary: 'Forgot password for admin' })
  // @UseGuards(AuthGuard)
  @Patch('forgotPassword/:id')
  forgotPassword(
    @Param('id') id: string,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.adminService.forgotPassword(id, forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Update admin profile by ID' })
  // @UseGuards(AuthGuard)
  @Patch('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.updateProfile(id, updateAdminDto);
  }

  @ApiOperation({ summary: 'Delete admin by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  deleteAdmin(@Param('id') id: string) {
    return this.adminService.deleteAdmin(id);
  }
}
