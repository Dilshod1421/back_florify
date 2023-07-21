import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalesmanService } from './salesman.service';
import { CreateSalesmanDto } from './dto/create-salesman.dto';
import { UpdateSalesmanDto } from './dto/update-salesman.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Salesman } from './models/salesman.model';
import { LoginSalesmanDto } from './dto/login-salesman.dto';

@ApiTags('Salesman')
@Controller('salesman')
export class SalesmanController {
  constructor(private readonly salesmanService: SalesmanService) {}

  @ApiOperation({ summary: 'Log in Salesman' })
  @ApiResponse({ status: 200, type: Salesman })
  @Post('signin')
  async login(@Body() loginSalesmanDto: LoginSalesmanDto) {
    return this.salesmanService.login(loginSalesmanDto);
  }

  @ApiOperation({ summary: 'Create new Salesman' })
  @ApiResponse({ status: 201, type: Salesman })
  @Post()
  async create(@Body() createSalesmanDto: CreateSalesmanDto) {
    return this.salesmanService.create(createSalesmanDto);
  }

  @ApiOperation({ summary: 'Get all Salesmans' })
  @ApiResponse({ status: 200, type: [Salesman] })
  @Get()
  async findAll() {
    return this.salesmanService.findAll();
  }

  @ApiOperation({ summary: 'Get Salesman by ID' })
  @ApiResponse({ status: 200, type: Salesman })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.salesmanService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Salesman by ID' })
  @ApiResponse({ status: 200, type: Salesman })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSalesmanDto: UpdateSalesmanDto,
  ) {
    return this.salesmanService.update(id, updateSalesmanDto);
  }

  @ApiOperation({ summary: 'Delete Salesman by ID' })
  @ApiResponse({ status: 200, type: Salesman })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.salesmanService.remove(id);
  }
}
