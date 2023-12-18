import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { AdminModule } from './admin/admin.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { ClientModule } from './client/client.module';
import { FilesModule } from './files/files.module';
import { ImageModule } from './image/image.module';
import { LikeModule } from './like/like.module';
import { OtpModule } from './otp/otp.module';
import { ProductModule } from './product/product.module';
import { SalesmanModule } from './salesman/salesman.module';
import { SocialNetworkModule } from './social-network/social-network.module';
import { SoldProductModule } from './sold-product/sold-product.module';
import { WatchedModule } from './watched/watched.module';
import { CommentModule } from './comment/comment.module';
import { AdvertisingModule } from './advertising/advertising.module';
import { OrdersModule } from './orders/orders.module';

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
      rootPath: resolve(__dirname, '..', 'static'),
    }),
    JwtModule.register({ global: true }),
    AdminModule,
    AdvertisingModule,
    CartModule,
    CategoryModule,
    ClientModule,
    CommentModule,
    FilesModule,
    ImageModule,
    LikeModule,
    OtpModule,
    ProductModule,
    SalesmanModule,
    SocialNetworkModule,
    SoldProductModule,
    WatchedModule,
    OrdersModule,
  ],
})
export class AppModule {}
