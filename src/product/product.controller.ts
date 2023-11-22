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
import { ProductService } from './product.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { ProductDto } from './dto/product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create new product' })
  // @UseGuards(AuthGuard)
  @Post()
  create(@Body() productDto: ProductDto) {
    return this.productService.create(productDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @Get('/:page_limit')
  findAll(@Param('page_limit') page_limit: string) {
    return this.productService.findAll(page_limit);
  }

  @ApiOperation({ summary: 'Pagination products' })
  // @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.productService.paginate(page);
  }

  @ApiOperation({ summary: 'Get by category id with pagination' })
  // @UseGuards(AuthGuard)
  @Get('categoryId/:id_page_limit')
  getByCategoryId(@Param('id_page_limit') id_page_limit: string) {
    return this.productService.getByCategoryId(id_page_limit);
  }

  @ApiOperation({ summary: 'Get by salesman_id with pagination' })
  // @UseGuards(AuthGuard)
  @Get('salesmanId/:salesman_id_page_limit')
  getBySalesmanId(@Param('salesman_id_page_limit') salesman_id_page_limit: string) {
    return this.productService.getBySalesmanId(salesman_id_page_limit);
  }

  @ApiOperation({ summary: 'Get present products' })
  @Get('present/:page_limit')
  present(@Param('page_limit') page_limit: string) {
    return this.productService.presents(page_limit);
  }

  @ApiOperation({ summary: 'Get product by ID' })
  // @UseGuards(AuthGuard)
  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.productService.findById(id);
  }

  @ApiOperation({ summary: 'Update product by ID' })
  // @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() productDto: ProductDto) {
    return this.productService.update(id, productDto);
  }

  @ApiOperation({ summary: 'Delete product by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
