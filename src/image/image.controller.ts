import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';
import { ImageDto } from './dto/image.dto';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Create new mage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        size: {
          type: 'string',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() imageDto: ImageDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.imageService.create(imageDto, image);
  }

  @ApiOperation({ summary: 'Get all images' })
  @Get()
  async findAll() {
    return this.imageService.findAll();
  }

  @ApiOperation({ summary: 'Get image by ID' })
  @Get('id/:id')
  async findById(@Param('id') id: string) {
    return this.imageService.findById(id);
  }

  @ApiOperation({ summary: 'Get image by ID' })
  @Get('productId/:id')
  async findByProductId(@Param('productId') product_id: number) {
    return this.imageService.findByProductId(product_id);
  }

  @ApiOperation({ summary: 'Update image by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        size: {
          type: 'string',
        },
      },
    },
  })
  @Patch('id/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateById(
    @Param('id') id: string,
    @Body() imageDto: ImageDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.imageService.updateById(id, imageDto, image);
  }

  @ApiOperation({ summary: 'Update image by product ID' })
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
  @Patch('productId')
  @UseInterceptors(FileInterceptor('image'))
  async updateByProductId(
    @Body() imageDto: ImageDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.imageService.updateByProductId(imageDto, image);
  }

  @ApiOperation({ summary: 'Delete image by ID' })
  @Delete('id/:id')
  async removeById(@Param('id') id: string) {
    return this.imageService.removeById(id);
  }

  @ApiOperation({ summary: 'Delete image by ID' })
  @Delete('productId/:id')
  async removeByProductId(@Param('productId') product_id: number) {
    return this.imageService.removeByProductId(product_id);
  }

  @ApiOperation({ summary: 'Delete image from static files by file name' })
  @Delete('delete/:id/:file_name')
  async deleteStaticFile(
    @Param('id') id: string,
    @Param('file_name') file_name: string,
  ) {
    return this.imageService.deleteStaticFile(id, file_name);
  }
}
