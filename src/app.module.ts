import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import { SalesmanModule } from './salesman/salesman.module';
import { SocialNetworkModule } from './social-network/social-network.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ImageModule } from './image/image.module';
import { ClientModule } from './client/client.module';
import { SoldProductModule } from './sold-product/sold-product.module';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { LikeModule } from './like/like.module';
import { WatchedModule } from './watched/watched.module';
import { CartModule } from './cart/cart.module';
import { OtpModule } from './otp/otp.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: String(process.env.PG_PASS),
      database: process.env.PG_DB,
      autoLoadModels: true,
      logging: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    JwtModule.register({ global: true }),
    AdminModule,
    SalesmanModule,
    SocialNetworkModule,
    CategoryModule,
    ProductModule,
    ImageModule,
    ClientModule,
    SoldProductModule,
    FilesModule,
    LikeModule,
    WatchedModule,
    CartModule,
    OtpModule,
    MailModule,
  ],
})
export class AppModule {}
