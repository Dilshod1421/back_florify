import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SoldProductService } from './sold-product.service';
import { CreateSoldProductDto } from './dto/create-sold-product.dto';
import { UpdateSoldProductDto } from './dto/update-sold-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SoldProduct } from './models/sold-product.model';

@ApiTags('Sold Product')
@Controller('sold-product')
export class SoldProductController {
  constructor(private readonly soldProductService: SoldProductService) {}

  @ApiOperation({ summary: 'Create new Sold Product' })
  @ApiResponse({ status: 201, type: SoldProduct })
  @Post()
  async create(@Body() createSoldProductDto: CreateSoldProductDto) {
    return this.soldProductService.create(createSoldProductDto);
  }

  @ApiOperation({ summary: 'Get all Sold Products' })
  @ApiResponse({ status: 200, type: [SoldProduct] })
  @Get()
  async findAll() {
    return this.soldProductService.findAll();
  }

  @ApiOperation({ summary: 'Get SoldProduct by ID' })
  @ApiResponse({ status: 200, type: SoldProduct })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.soldProductService.findOne(id);
  }

  @ApiOperation({ summary: 'Update SoldProduct by ID' })
  @ApiResponse({ status: 200, type: SoldProduct })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSoldProductDto: UpdateSoldProductDto,
  ) {
    return this.soldProductService.update(id, updateSoldProductDto);
  }

  @ApiOperation({ summary: 'Delete SoldProduct by ID' })
  @ApiResponse({ status: 200, type: SoldProduct })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.soldProductService.remove(id);
  }
}
