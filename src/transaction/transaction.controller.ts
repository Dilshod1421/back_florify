import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/transaction.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Transaction')
@Controller('transaction')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Create or Update transaction' })
  @Post('pay')
  create(@Body() transactionDto: TransactionDto) {
    return this.transactionService.create(transactionDto);
  }

  @ApiOperation({ summary: 'Get all transactions' })
  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @ApiOperation({ summary: 'Get transaction by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findById(id);
  }
}
