import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { Otp } from 'src/admin/models/otp.model';

@Module({
  imports: [SequelizeModule.forFeature([Client, Otp])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
