import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const config = new DocumentBuilder()
  .setTitle('Documentação')
  .setDescription('')
  .setVersion('1.0')
  .addTag('user')
  .addTag('book')
  .addTag('genre')
  .addTag('rentals')
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useBodyParser('json')
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  
}
bootstrap();
