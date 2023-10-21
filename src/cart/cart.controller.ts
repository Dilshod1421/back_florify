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
import { CartService } from './cart.service';
import { CartDto } from './dto/cart.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'add like to product' })
  @Post()
  create(@Body() cartDto: CartDto) {
    return this.cartService.create(cartDto);
  }

  @ApiOperation({ summary: 'get all likes' })
  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @ApiOperation({ summary: 'get one by client and product ID' })
  @Get('findOne')
  findOne(@Body() cartDto: CartDto) {
    return this.cartService.findOne(cartDto);
  }

  @ApiOperation({ summary: 'get one by client ID' })
  @Get('clientId/:clientId')
  findByClientId(@Param('clientId') clientId: string) {
    return this.cartService.findByClientId(clientId);
  }

  @ApiOperation({ summary: 'get one by product ID' })
  @Get('productId/:productId')
  findByProductId(@Param('productId') productId: number) {
    return this.cartService.findByProductId(productId);
  }

  @ApiOperation({ summary: 'delete like from product' })
  @Delete()
  remove(@Body() cartDto: CartDto) {
    return this.cartService.remove(cartDto);
  }
}
