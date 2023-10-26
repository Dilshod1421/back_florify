import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
  
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 3000;
    app.enableCors();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    const config = new DocumentBuilder()
      .setTitle('NestJS')
      .setDescription('REST API')
      .setVersion('1.0.0')
      .addTag('NodeJS, NestJS, Postgres, sequelize')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);
    app.use((req: any, res: any, next: any) => {
      const start_time = Date.now();
      res.on('finish', () => {
        const end_time = Date.now();
        const response_time = end_time - start_time;
        console.log(
          `${req.method} ${req.originalUrl} ${res.statusCode} ${response_time}ms`,
        );
      });
      next();
    });
    await app.listen(PORT, () => {
      console.log('Server listening on port', +PORT);
    });
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}
bootstrap();
