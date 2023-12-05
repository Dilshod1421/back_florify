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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { Response } from 'express';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';
import { SalesmanDto } from './dto/salesman.dto';
import { SalesmanService } from './salesman.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';
import { LoginSalesmanDto } from './dto/login-salesman.dto';
import { NewPasswordDto } from 'src/admin/dto/new-password.dto';
import { ForgotPasswordDto } from 'src/admin/dto/forgot-password.dto';
import { UpdateSalesmanDto } from './dto/update-salesman.dto';
import { StoreDto } from './dto/store.dto';

@ApiTags('Salesman')
@Controller('salesman')
export class SalesmanController {
  constructor(private readonly salesmanService: SalesmanService) {}

  @ApiOperation({ summary: 'Registration a new salesman' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        username: {
          type: 'string',
        },
        address: {
          type: 'string',
        },
        telegram: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  register(
    @Body() salesmanDto: SalesmanDto,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile(new ImageValidationPipe()) image?: Express.Multer.File,
  ) {
    return this.salesmanService.register(salesmanDto, res, image);
  }

  @ApiOperation({ summary: 'Login salesman with send OTP' })
  @Post('login')
  login(@Body() loginDto: LoginSalesmanDto) {
    return this.salesmanService.login(loginDto);
  }

  @ApiOperation({ summary: 'Verify login salesman' })
  @Post('verifyLogin')
  verifLogin(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.salesmanService.verifyLogin(verifyOtpDto, res);
  }

  @ApiOperation({ summary: 'Logout salesman' })
  // @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.salesmanService.logout(refresh_token, res);
  }

  @ApiOperation({ summary: 'Get all salesmans' })
  // @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.salesmanService.getAll();
  }

  @ApiOperation({ summary: 'Get salesman by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.salesmanService.getById(id);
  }

  @ApiOperation({ summary: 'Get salesmans with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.salesmanService.pagination(page, limit);
  }

  @ApiOperation({ summary: 'New password of salesman' })
  // @UseGuards(AuthGuard)
  @Patch('newPassword/:id')
  newPassword(@Param('id') id: string, @Body() newPasswordDto: NewPasswordDto) {
    return this.salesmanService.newPassword(id, newPasswordDto);
  }

  @ApiOperation({ summary: 'Forgot password for salesman' })
  // @UseGuards(AuthGuard)
  @Patch('forgotPassword/:id')
  forgotPassword(
    @Param('id') id: string,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.salesmanService.forgotPassword(id, forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Update salesman profile by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        username: {
          type: 'string',
        },
        address: {
          type: 'string',
        },
        telegram: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // @UseGuards(AuthGuard)
  @Patch('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateDto: UpdateSalesmanDto,
    @UploadedFile(new ImageValidationPipe()) image?: Express.Multer.File,
  ) {
    return this.salesmanService.updateProfile(id, updateDto, image);
  }

  @ApiOperation({ summary: 'Update store information' })
  @Patch('store/:id')
  updateStore(@Param('id') id: string, @Body() storeDto: StoreDto) {
    return this.salesmanService.updateStore(id, storeDto);
  }

  @ApiOperation({ summary: 'Delete salesman by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.salesmanService.delete(id);
  }
}
