import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Write comment to product' })
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @ApiOperation({ summary: 'Get all comments' })
  @Get()
  getAll() {
    return this.commentService.getAll();
  }

  @ApiOperation({ summary: 'Get comments by product ID' })
  @Get('productId/:product_id')
  getByProductId(@Param('product_id') product_id: number) {
    return this.commentService.getByProductId(product_id);
  }

  @ApiOperation({ summary: 'Get comment by ID' })
  @Get('id/:id')
  getById(@Param('id') id: string) {
    return this.commentService.getById(id);
  }

  @ApiOperation({ summary: 'Edit comment by ID' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @ApiOperation({ summary: 'Delete comment by ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.delete(id);
  }
}
