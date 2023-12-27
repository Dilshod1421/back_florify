import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Order')
@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create order' })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findById(id);
  }

  @ApiOperation({ summary: 'Get order by client ID' })
  @Get()
  getByClientId(@Req() request) {
    const user_id = request?.user?.id;
    if (!user_id) {
      throw new BadRequestException('Tokendan client_id topilmadi');
    }
    return this.ordersService.getByClientId(user_id);
  }

  @ApiOperation({ summary: 'Edit order by ID' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Delete order by ID' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.ordersService.delete(id);
  }
}
