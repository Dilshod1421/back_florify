import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { WatchedService } from './watched.service';
import { WatchedDto } from './dto/watched.dto';

@Controller('like')
export class WatchedController{
  constructor(private readonly watchedService: WatchedService) {}

  @ApiOperation({ summary: 'add product to watched list' })
  @Post()
  create(@Body() watchedDto: WatchedDto) {
    return this.watchedService.create(watchedDto);
  }

  @ApiOperation({ summary: 'get all watched products' })
  @Get()
  findAll() {
    return this.watchedService.findAll();
  }

  @ApiOperation({ summary: 'get one by client and product ID' })
  @Get('findOne')
  findOne(@Body() watchedDto: WatchedDto) {
    return this.watchedService.findOne(watchedDto);
  }

  @ApiOperation({ summary: 'get one by client ID' })
  @Get('clientId/:clientId')
  findByClientId(@Param('clientId') clientId: string) {
    return this.watchedService.findByClientId(clientId);
  }

  @ApiOperation({ summary: 'get one by product ID' })
  @Get('productId/:productId')
  findByProductId(@Param('productId') productId: number) {
    return this.watchedService.findByProductId(productId);
  }

  @ApiOperation({ summary: 'delete like from product' })
  @Delete()
  remove(@Body() watchedDto: WatchedDto) {
    return this.watchedService.remove(watchedDto);
  }
}
