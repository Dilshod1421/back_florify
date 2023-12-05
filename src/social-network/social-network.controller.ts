import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SocialNetworkService } from './social-network.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { SocialNetworkDto } from './dto/social-network.dto';
import { UpdateSocialDto } from './dto/update-social-network.dto';

@ApiTags('Social network')
@Controller('socialNetwork')
export class SocialNetworkController {
  constructor(private readonly socialNetworkService: SocialNetworkService) {}

  @ApiOperation({ summary: 'Create a new social network' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() socialNetworkDto: SocialNetworkDto) {
    return this.socialNetworkService.create(socialNetworkDto);
  }

  @ApiOperation({ summary: 'Get all social networks' })
  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.socialNetworkService.getAll();
  }

  @ApiOperation({ summary: 'Get social network by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.socialNetworkService.getById(id);
  }

  @ApiOperation({ summary: 'Pagination social networks' })
  @UseGuards(AuthGuard)
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.socialNetworkService.pagination(page, limit);
  }

  @ApiOperation({ summary: 'Update social network by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSocialDto: UpdateSocialDto) {
    return this.socialNetworkService.update(id, updateSocialDto);
  }

  @ApiOperation({ summary: 'Delete social network by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.socialNetworkService.delete(id);
  }
}
