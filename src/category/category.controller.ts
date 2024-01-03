import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { CategoryDto } from './dto/category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
        uz_description: {
          type: 'string',
        },
        ru_description: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() categoryDto: CategoryDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.categoryService.create(categoryDto, file);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @Get()
  getAll() {
    return this.categoryService.getAll();
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.categoryService.getById(id);
  }

  @ApiOperation({ summary: 'Get all categories for mobile' })
  @Get('all')
  getAllForMobile() {
    return this.categoryService.getAllForMobile();
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @Get('id/:id')
  getByIdForMobile(@Param('id') id: string) {
    return this.categoryService.getByIdForMobile(id);
  }

  @ApiOperation({ summary: 'Get categories with pagination' })
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.categoryService.pagination(page, limit);
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
        uz_description: {
          type: 'string',
        },
        ru_description: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCategoryDto,
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.categoryService.update(id, updateDto, file);
  }

  @ApiOperation({ summary: 'Delete category by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
