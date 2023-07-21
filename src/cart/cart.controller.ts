import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cart } from './models/cart.model';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Create new Cart' })
  @ApiResponse({ status: 201, type: Cart })
  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @ApiOperation({ summary: 'Get all Carts' })
  @ApiResponse({ status: 200, type: [Cart] })
  @Get()
  async findAll() {
    return this.cartService.findAll();
  }

  @ApiOperation({ summary: 'Get Cart by ID' })
  @ApiResponse({ status: 200, type: Cart })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Cart by ID' })
  @ApiResponse({ status: 200, type: Cart })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @ApiOperation({ summary: 'Delete Cart by ID' })
  @ApiResponse({ status: 200, type: Cart })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
