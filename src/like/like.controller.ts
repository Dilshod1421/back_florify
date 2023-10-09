import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiOperation } from '@nestjs/swagger';
import { LikeDto } from './dto/like.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: 'add like to product' })
  @Post()
  create(@Body() likeDto: LikeDto) {
    return this.likeService.create(likeDto);
  }

  @ApiOperation({ summary: 'get all likes' })
  @Get()
  findAll() {
    return this.likeService.findAll();
  }

  @ApiOperation({ summary: 'get one by client and product ID' })
  @Get('findOne')
  findOne(@Body() likeDto: LikeDto) {
    return this.likeService.findOne(likeDto);
  }

  @ApiOperation({ summary: 'get one by client ID' })
  @Get('clientId/:clientId')
  findByClientId(@Param('clientId') clientId: string) {
    return this.likeService.findByClientId(clientId);
  }

  @ApiOperation({ summary: 'get one by product ID' })
  @Get('productId/:productId')
  findByProductId(@Param('productId') productId: number) {
    return this.likeService.findByProductId(productId);
  }

  @ApiOperation({ summary: 'delete like from product' })
  @Delete()
  remove(@Body() likeDto: LikeDto) {
    return this.likeService.remove(likeDto);
  }
}
