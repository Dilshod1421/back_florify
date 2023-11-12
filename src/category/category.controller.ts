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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { CategoryDto } from './dto/category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create new category' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        uz: {
          type: 'string',
        },
        ru: {
          type: 'string',
        },
        en: {
          type: 'string',
        },
        uz_description: {
          type: 'string',
        },
        ru_description: {
          type: 'string',
        },
        en_description: {
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
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() categoryDto: CategoryDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.categoryService.create(categoryDto, image);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Pagination categories' })
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.categoryService.paginate(page);
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @Get('idPage/:idPageLimit')
  findByIdPage(@Param('idPageLimit') id: string) {
    return this.categoryService.findByIdPage(id);
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @ApiOperation({ summary: 'Update category by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        uz: {
          type: 'string',
        },
        ru: {
          type: 'string',
        },
        en: {
          type: 'string',
        },
        uz_description: {
          type: 'string',
        },
        ru_description: {
          type: 'string',
        },
        en_description: {
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
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() categoryDto: CategoryDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.categoryService.update(id, categoryDto, image);
  }

  @ApiOperation({ summary: 'Delete category by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
