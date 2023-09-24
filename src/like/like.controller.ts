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

  @ApiOperation({ summary: 'delete like from product' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.remove(id);
  }
}
