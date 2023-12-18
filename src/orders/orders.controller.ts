import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create order' })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @ApiOperation({ summary: 'Edit order by ID' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Delete order by ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}
