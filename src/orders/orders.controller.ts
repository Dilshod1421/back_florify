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
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({ summary: 'Get all orders' })
  @Get()
  getAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Get order by client ID' })
  @Get('own')
  getByClientId(@Req() request) {
    const user_id = request?.user?.id;
    if (!user_id) {
      throw new BadRequestException('Tokendan client_id topilmadi');
    }
    return this.ordersService.getByClientId(user_id);
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findById(id);
  }

  @ApiOperation({ summary: 'Get orders with pagination' })
  @Get('pagination/:page/:limit')
  pagination(@Param('page') page: number, @Param('limit') limit: number) {
    return this.ordersService.pagination(page, limit);
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

  @ApiOperation({
    summary: 'Receiving orders related to the seller with pagination',
  })
  @Get('/search/salesmanId/:salesman_id/:page')
  @ApiQuery({
    name: 'order_id',
    required: false,
    description: 'id of the order',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'status of the order',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'createdAt of the order',
  })
  searchProduct(
    @Param('salesman_id') salesman_id: string,
    @Param('page') page: number,
    @Query('order_id') order_id?: number,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.ordersService.searchForSalesman(
      salesman_id,
      page,
      order_id,
      status,
      date,
    );
  }
}
