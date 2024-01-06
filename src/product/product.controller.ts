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
import { UpdateProducDto } from './dto/update-product.dto';
import { WatchedTokenDto } from './dto/watched-token.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new product' })
  // @UseGuards(AuthGuard)
  @Post()
  create(@Body() productDto: ProductDto) {
    return this.productService.create(productDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @Get()
  getAll() {
    return this.productService.getAll();
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @Get('id/:id')
  getById(@Param('id') id: number, @Body() tokenDto?: WatchedTokenDto) {
    return this.productService.getById(id, tokenDto);
  }

  @ApiOperation({ summary: 'Get product by ID with details' })
  @Get('details/:id')
  detailsForMobile(@Param('id') id: number) {
    return this.productService.detailsForMobile(id);
  }

  @ApiOperation({ summary: 'Get products by category ID with pagination' })
  // @UseGuards(AuthGuard)
  @Get('categoryId/:category_id/:page/:limit')
  getByCategoryId(
    @Param('category_id') category_id: string,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    return this.productService.getByCategoryId(category_id, page, limit);
  }

  @ApiOperation({ summary: 'Get products by salesman ID with pagination' })
  // @UseGuards(AuthGuard)
  @Get('salesmanId/:salesman_id/:page/:limit/:quantity')
  getBySalesmanId(
    @Param('salesman_id') salesman_id: string,
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('quantity') quantity: string,
  ) {
    return this.productService.getBySalesmanId(
      salesman_id,
      page,
      limit,
      quantity,
    );
  }

  @ApiOperation({ summary: 'Get products with pagination' })
  // @UseGuards(AuthGuard)
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.productService.pagination(page, limit);
  }

  @ApiOperation({ summary: 'Get present products with pagination' })
  @Get('presents/:page/:limit')
  presents(@Param('page') page: number, @Param('limit') limit: number) {
    return this.productService.presents(page, limit);
  }

  @ApiOperation({ summary: 'Search products' })
  @Get('search/:page')
  searchProduct(@Query('query') query?: string, @Param('page') page?: number) {
    return this.productService.searchProduct(query, page);
  }

  @ApiOperation({ summary: 'Update product by ID' })
  // @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProducDto) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete product by ID' })
  // @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
