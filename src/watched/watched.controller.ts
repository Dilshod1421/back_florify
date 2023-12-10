import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WatchedService } from './watched.service';
import { WatchedDto } from './dto/watched.dto';

@ApiTags('Watched')
@Controller('watched')
export class WatchedController {
  constructor(private readonly watchedService: WatchedService) {}

  @ApiOperation({ summary: 'Add product to watched' })
  @Post()
  create(@Body() watchedDto: WatchedDto) {
    return this.watchedService.create(watchedDto);
  }

  @ApiOperation({ summary: 'Get watched products by client ID' })
  @Get('clientId/:clientId')
  getByClientId(@Param('clientId') client_id: string) {
    return this.watchedService.getByClientId(client_id);
  }

  @ApiOperation({
    summary: 'Get watched product by client ID and product ID',
  })
  @Get('id/:client_id/:product_id')
  getOne(
    @Param('client_id') client_id: string,
    @Param('product_id') product_id: number,
  ) {
    return this.watchedService.getOne(client_id, product_id);
  }

  @ApiOperation({
    summary: 'Get wathced products with pagination by client ID',
  })
  @Get('pagination/:client_id/:page/:limit')
  pagination(
    @Param('client_id') client_id: string,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    return this.watchedService.pagination(client_id, page, limit);
  }

  @ApiOperation({ summary: 'Remove product from watched' })
  @Delete()
  delete(@Body() watchedDto: WatchedDto) {
    return this.watchedService.delete(watchedDto);
  }
}
