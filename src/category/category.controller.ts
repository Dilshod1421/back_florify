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
import { CategoryService } from './category.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { CategoryDto } from './dto/category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create new category' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() categoryDto: CategoryDto) {
    return this.categoryService.create(categoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Pagination categories' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.categoryService.paginate(page);
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @ApiOperation({ summary: 'Update category by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() categoryDto: CategoryDto) {
    return this.categoryService.update(id, categoryDto);
  }

  @ApiOperation({ summary: 'Delete category by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
