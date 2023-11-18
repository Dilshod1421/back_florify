import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WatchedService } from './watched.service';
import { WatchedDto } from './dto/watched.dto';

@ApiTags('Watched')
@Controller('watched')
export class WatchedController {
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
  @Get('clientId/:idPageLimit')
  findByClientId(@Param('idPageLimit') idPageLimit: string) {
    return this.watchedService.findByClientId(idPageLimit);
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
