import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Image } from './models/image.model';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Create new Image' })
  @ApiResponse({ status: 201, type: Image })
  @Post()
  async create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @ApiOperation({ summary: 'Get all Images' })
  @ApiResponse({ status: 200, type: [Image] })
  @Get()
  async findAll() {
    return this.imageService.findAll();
  }

  @ApiOperation({ summary: 'Get Image by ID' })
  @ApiResponse({ status: 200, type: Image })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.imageService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Image by ID' })
  @ApiResponse({ status: 200, type: Image })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imageService.update(id, updateImageDto);
  }

  @ApiOperation({ summary: 'Delete Image by ID' })
  @ApiResponse({ status: 200, type: Image })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.imageService.remove(id);
  }
}
