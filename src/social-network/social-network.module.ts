import { Module, forwardRef } from '@nestjs/common';
import { SocialNetworkService } from './social-network.service';
import { SocialNetworkController } from './social-network.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SocialNetwork } from './models/social-network.model';
import { SalesmanModule } from '../salesman/salesman.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SocialNetwork]),
    forwardRef(() => SalesmanModule),
  ],
  controllers: [SocialNetworkController],
  providers: [SocialNetworkService],
  exports: [SocialNetworkService],
})
export class SocialNetworkModule {}
