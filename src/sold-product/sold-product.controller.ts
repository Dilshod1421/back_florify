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
import { SoldProductService } from './sold-product.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { SoldProductDto } from './dto/sold-product.dto';

@ApiTags('Sold Product')
@Controller('sold-product')
export class SoldProductController {
  constructor(private readonly soldProductService: SoldProductService) {}

  @ApiOperation({ summary: 'Create new sold product' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() soldProductDto: SoldProductDto) {
    return this.soldProductService.create(soldProductDto);
  }

  @ApiOperation({ summary: 'Get all sold products' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.soldProductService.findAll();
  }

  @ApiOperation({ summary: 'Pagination sold products' })
  @UseGuards(AuthGuard)
  @Get('page')
  paginate(@Query('page') page: number) {
    return this.soldProductService.paginate(page);
  }

  @ApiOperation({ summary: 'Get sold product by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soldProductService.findById(id);
  }

  @ApiOperation({ summary: 'Update sold product by ID' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() soldProductDto: SoldProductDto) {
    return this.soldProductService.update(id, soldProductDto);
  }

  @ApiOperation({ summary: 'Delete sold product by ID' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.soldProductService.remove(id);
  }
}
