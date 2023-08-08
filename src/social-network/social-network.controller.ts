import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SocialNetworkService } from './social-network.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { SocialNetworkDto } from './dto/social-network.dto';

@ApiTags('Social Network')
@Controller('social-network')
export class SocialNetworkController {
  constructor(private readonly socialNetworkService: SocialNetworkService) {}

  @ApiOperation({ summary: 'Create new social network' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() socialNetworkDto: SocialNetworkDto) {
    return this.socialNetworkService.create(socialNetworkDto);
  }

  @ApiOperation({ summary: 'Get all social networks' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.socialNetworkService.findAll();
  }

  @ApiOperation({ summary: 'Pagination social networks' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.socialNetworkService.paginate(page);
  }

  @ApiOperation({ summary: 'Get social network by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.socialNetworkService.findById(id);
  }

  @ApiOperation({ summary: 'Update social network by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() socialNetworkDto: SocialNetworkDto) {
    return this.socialNetworkService.update(id, socialNetworkDto);
  }

  @ApiOperation({ summary: 'Delete social network by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialNetworkService.remove(id);
  }
}
