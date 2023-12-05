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
  @Get('id/:clientId_productId')
  getOne(@Param('clientId_productId') clientId_productId: string) {
    return this.watchedService.getOne(clientId_productId);
  }

  @ApiOperation({
    summary: 'Get wathced products with pagination by client ID',
  })
  @Get('pagination/:clientId_page_limit')
  pagination(@Param('clientId_page_limit') clientId_page_limit: string) {
    return this.watchedService.pagination(clientId_page_limit);
  }

  @ApiOperation({ summary: 'Remove product from watched' })
  @Delete()
  delete(@Body() watchedDto: WatchedDto) {
    return this.watchedService.delete(watchedDto);
  }
}
