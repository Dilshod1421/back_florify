import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Client } from './models/client.model';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperation({ summary: 'Create new Client' })
  @ApiResponse({ status: 201, type: Client })
  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @ApiOperation({ summary: 'Get all Clients' })
  @ApiResponse({ status: 200, type: [Client] })
  @Get()
  async findAll() {
    return this.clientService.findAll();
  }

  @ApiOperation({ summary: 'Get Client by ID' })
  @ApiResponse({ status: 200, type: Client })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Client by ID' })
  @ApiResponse({ status: 200, type: Client })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.update(id, updateClientDto);
  }

  @ApiOperation({ summary: 'Delete Client by ID' })
  @ApiResponse({ status: 200, type: Client })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
