import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'create new image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.imageService.create(image);
  }

  @ApiOperation({ summary: 'get all Image' })
  @Get()
  async findAll() {
    return this.imageService.findAll();
  }

  @ApiOperation({ summary: 'get image by file name' })
  @Get(':fileName')
  async findOne(@Param('fileName') file_name: string, @Res() res: Response) {
    return this.imageService.findOne(file_name, res);
  }

  @ApiOperation({ summary: 'delete image by file name' })
  @Delete(':fileName')
  async remove(@Param('fileName') file_name: string) {
    return this.imageService.remove(file_name);
  }
}
