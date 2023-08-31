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
  // @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Pagination products' })
  // @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.productService.paginate(page);
  }

  @ApiOperation({ summary: 'Get product by ID' })
  // @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @ApiOperation({ summary: 'Update product by ID' })
  // @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() productDto: ProductDto) {
    return this.productService.update(id, productDto);
  }

  @ApiOperation({ summary: 'Delete product by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
