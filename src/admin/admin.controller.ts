import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Send OTP to phone number of the admin' })
  @Post('checkPhone')
  async checkPhone(@Body() phoneAdminDto: PhoneAdminDto) {
    return this.adminService.checkPhone(phoneAdminDto);
  }

  @ApiOperation({ summary: 'Registration a new admin' })
  @Post('register')
  async register(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.register(createAdminDto);
  }

  @ApiOperation({ summary: 'Log in admin' })
  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @ApiOperation({ summary: 'Get all admins' })
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, type: Admin })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.adminService.findById(id);
  }

  @ApiOperation({ summary: 'Update admin by ID' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @ApiOperation({ summary: 'Send sms to phone number' })
  @Post('sms')
  async sendSMS() {
    return this.adminService.sendSMS();
  }

  @ApiOperation({ summary: 'forgot password' })
  @Post('forgotPassword/:email')
  async forgotPassword(@Param('email') email: string, @Body() code: string) {
    return this.adminService.forgotPassword(email, code);
  }

  @ApiOperation({ summary: 'New password of the admin' })
  @Post(':id')
  async newPassword(
    @Param('id') id: string,
    @Body() newPasswordAdminDto: NewPasswordAdminDto,
  ) {
    return this.adminService.newPassword(id, newPasswordAdminDto);
  }

  @ApiOperation({ summary: 'Delete admin by ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
