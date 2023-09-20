import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import * as fs from 'fs';

dotenv.config();

async function bootstrap() {
  // Replace with the correct path to your spec file
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger setup
  const options = new DocumentBuilder()
    .setTitle('Blue Sky Analytics')
    .setDescription('People By State Assignment')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(3000);
}

bootstrap();
