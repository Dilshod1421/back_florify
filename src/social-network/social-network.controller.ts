import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SocialNetworkService } from './social-network.service';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SocialNetwork } from './models/social-network.model';

@ApiTags('Social Network')
@Controller('social-network')
export class SocialNetworkController {
  constructor(private readonly socialNetworkService: SocialNetworkService) {}

  @ApiOperation({ summary: 'Create new Social Network' })
  @ApiResponse({ status: 201, type: SocialNetwork })
  @Post()
  async create(@Body() createSocialNetworkDto: CreateSocialNetworkDto) {
    return this.socialNetworkService.create(createSocialNetworkDto);
  }

  @ApiOperation({ summary: 'Get all Social Networks' })
  @ApiResponse({ status: 200, type: [SocialNetwork] })
  @Get()
  async findAll() {
    return this.socialNetworkService.findAll();
  }

  @ApiOperation({ summary: 'Get Social Network by ID' })
  @ApiResponse({ status: 200, type: SocialNetwork })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.socialNetworkService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Social Network by ID' })
  @ApiResponse({ status: 200, type: SocialNetwork })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSocialNetworkDto: UpdateSocialNetworkDto,
  ) {
    return this.socialNetworkService.update(id, updateSocialNetworkDto);
  }

  @ApiOperation({ summary: 'Delete Social Network by ID' })
  @ApiResponse({ status: 200, type: SocialNetwork })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.socialNetworkService.remove(id);
  }
}
