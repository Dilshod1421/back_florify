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

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Create new Image' })
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

  @ApiOperation({ summary: 'Get All Image' })
  @Get()
  async findAll() {
    return this.imageService.findAll();
  }

  @ApiOperation({ summary: 'Get Image by file name' })
  @Get(':fileName')
  async findOne(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.imageService.findOne(fileName, res);
  }

  @ApiOperation({ summary: 'Delete Image by file name' })
  @Delete(':fileName')
  async remove(@Param('fileName') fileName: string) {
    return this.imageService.remove(fileName);
  }
}
