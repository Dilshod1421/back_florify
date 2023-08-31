import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';

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
      },
    },
  })
  @Post('create/:productId')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Param('productId') productId: string,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.imageService.create(productId, image);
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
  @Get('productId:id')
  async findByProductId(@Param('productId') product_id: string) {
    return this.imageService.findByProductId(product_id);
  }

  @ApiOperation({ summary: 'Update image by ID' })
  @Patch('id/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateById(
    @Param('id') id: string,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.imageService.updateById(id, image);
  }

  @ApiOperation({ summary: 'Update image by product ID' })
  @Patch('productId/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateByProductId(
    @Param('productId') product_id: string,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.imageService.updateByProductId(product_id, image);
  }

  @ApiOperation({ summary: 'Delete image by ID' })
  @Delete('id/:id')
  async removeById(@Param('id') id: string) {
    return this.imageService.remove(id);
  }

  @ApiOperation({ summary: 'Delete image by ID' })
  @Delete('productId/:id')
  async removeByProductId(@Param('productId') product_id: string) {
    return this.imageService.removeByProductId(product_id);
  }
}
