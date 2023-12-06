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
import { ImageUpdateDto } from './dto/image-update.dto';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Create a new mage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        product_id: {
          type: 'number',
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
  async getAll() {
    return this.imageService.getAll();
  }

  @ApiOperation({ summary: 'Get image by ID' })
  @Get('id/:id')
  async getById(@Param('id') id: string) {
    return this.imageService.getById(id);
  }

  @ApiOperation({ summary: 'Get image by ID' })
  @Get('productId/:product_id')
  async getByProductId(@Param('product_id') product_id: number) {
    return this.imageService.getByProductId(product_id);
  }

  @ApiOperation({ summary: 'Get images with pagination' })
  @Get('pagination/:page/:limit')
  async pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.imageService.pagination(page, limit);
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
        product_id: {
          type: 'number',
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
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateById(
    @Param('id') id: string,
    @Body() imageUpdateDto: ImageUpdateDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.imageService.updateImage(id, imageUpdateDto, image);
  }

  @ApiOperation({ summary: 'Delete image by ID' })
  @Delete('id/:id')
  async deleteById(@Param('id') id: string) {
    return this.imageService.deleteById(id);
  }

  @ApiOperation({ summary: 'Delete image by product ID' })
  @Delete('productId/:product_id')
  async deleteByProductId(@Param('product_id') product_id: number) {
    return this.imageService.deleteByProductId(product_id);
  }
}
