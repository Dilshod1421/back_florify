import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WatchedService } from './watched.service';

@ApiTags('Watched')
@Controller('watched')
export class WatchedController {
  constructor(private readonly watchedService: WatchedService) {}

  @ApiOperation({ summary: 'Get all watched products' })
  @Get()
  getAll() {
    return this.watchedService.getAll();
  }

  @ApiOperation({ summary: 'Get watched products by client ID' })
  @Get('productId/:product_id')
  getByProductId(@Param('product_id') product_id: number) {
    return this.watchedService.getByProductId(product_id);
  }

  @ApiOperation({
    summary: 'Get watched products with pagination',
  })
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.watchedService.pagination(page, limit);
  }
}
