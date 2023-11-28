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

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Add product to cart of client' })
  @Post()
  create(@Body() cartDto: CartDto) {
    return this.cartService.create(cartDto);
  }

  @ApiOperation({ summary: 'Get all products from cart' })
  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @ApiOperation({
    summary: 'Get product by cliend ID and product ID',
    description:
      '/clientID:productID  ->  11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000:1',
  })
  @Get(':ids')
  findOne(@Param() ids: string) {
    return this.cartService.findOne(ids);
  }

  @ApiOperation({ summary: "Get products from client's cart" })
  @Get('clientID/:clientID')
  findByClientId(@Param('clientID') clientID: string) {
    return this.cartService.findByClientId(clientID);
  }

  @ApiOperation({ summary: "Delete product from client's cart" })
  @Delete()
  remove(@Param(':ids') ids: string) {
    return this.cartService.remove(ids);
  }
}
