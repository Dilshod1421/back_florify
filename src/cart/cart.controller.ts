import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: "Add product to client's cart" })
  @Post()
  create(@Body() cartDto: CartDto) {
    return this.cartService.create(cartDto);
  }

  @ApiOperation({ summary: "Get products from client's cart" })
  @Get('clientId/:client_id')
  getByClientId(@Param('clientId') client_id: string) {
    return this.cartService.getByClientId(client_id);
  }

  @ApiOperation({
    summary: "Get product from client's cart by cart ID and client ID",
  })
  @Get('id/:id/:client_id')
  getByCartIdAndClientId(
    @Param('id') id: string,
    @Param('client_id') client_id: string,
  ) {
    return this.cartService.getByCartIdAndClientId(id, client_id);
  }

  @ApiOperation({
    summary: "Get product from client's cart by client ID with pagination",
  })
  @Get('pagination/:client_id/:page/:limit')
  getByClientIdWithPagination(
    @Param('client_id') client_id: string,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    return this.cartService.getByClientIdWithPagination(client_id, page, limit);
  }

  @ApiOperation({ summary: "Delete product from client's cart" })
  @Delete()
  deleteCart(@Param(':id') id: string) {
    return this.cartService.deleteCart(id);
  }
}
