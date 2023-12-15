import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import { CreateAdvertisingDto } from './dto/create-advertising.dto';
import { UpdateAdvertisingDto } from './dto/update-advertising.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';

@ApiTags('Advertising')
@Controller('advertising')
export class AdvertisingController {
  constructor(private readonly advertisingService: AdvertisingService) {}

  @ApiOperation({ summary: 'Create a new advertising' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        discount: {
          type: 'number',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createAdvertisingDto: CreateAdvertisingDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.advertisingService.create(createAdvertisingDto, file);
  }

  @ApiOperation({ summary: 'Get all advertisings' })
  @Get()
  findAll() {
    return this.advertisingService.getAll();
  }

  @ApiOperation({ summary: 'Get advertising by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.advertisingService.getById(id);
  }

  @ApiOperation({ summary: 'Update advertising by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        discount: {
          type: 'number',
        },
      },
    },
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateAdvertisingDto: UpdateAdvertisingDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.advertisingService.update(id, updateAdvertisingDto, file);
  }

  @ApiOperation({ summary: 'Delete advertising' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.advertisingService.delete(id);
  }
}
