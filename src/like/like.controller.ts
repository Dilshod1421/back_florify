import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeDto } from './dto/like.dto';

@ApiTags('Like/favourite')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({ summary: 'Add product to my favourites' })
  @Post()
  create(@Body() likeDto: LikeDto) {
    return this.likeService.create(likeDto);
  }

  @ApiOperation({ summary: 'Get favourites products by client ID' })
  @Get('clientId/:client_id')
  getByClientId(@Param('client_id') client_id: string) {
    return this.likeService.getByClientId(client_id);
  }

  @ApiOperation({
    summary: 'Get favourite product by client ID and product ID',
  })
  @Get('id/:client_id/:product_id')
  getOne(
    @Param('client_id') client_id: string,
    @Param('product_id') product_id: number,
  ) {
    return this.likeService.getOne(client_id, product_id);
  }

  @ApiOperation({
    summary: 'Get favourites products with pagination by client ID',
  })
  @Get('pagination/:client_id/:page/:limit')
  pagination(
    @Param('client_id') client_id: string,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    return this.likeService.pagination(client_id, page, limit);
  }

  @ApiOperation({ summary: 'Remove product from favourites' })
  @Delete()
  delete(@Body() likeDto: LikeDto) {
    return this.likeService.delete(likeDto);
  }
}
