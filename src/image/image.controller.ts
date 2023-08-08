import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { ImageDto } from './dto/image.dto';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Create new image' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() imageDto: ImageDto) {
    return this.imageService.create(imageDto);
  }

  @ApiOperation({ summary: 'Get all images' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @ApiOperation({ summary: 'Pagination images' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.imageService.paginate(page);
  }

  @ApiOperation({ summary: 'Get image by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.imageService.findById(id);
  }

  @ApiOperation({ summary: 'Update image by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() imageDto: ImageDto) {
    return this.imageService.update(id, imageDto);
  }

  @ApiOperation({ summary: 'Delete Image by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(id);
  }
}
