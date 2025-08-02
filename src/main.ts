import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';

const swaggerDocument = require(path.join(__dirname, '../swagger.json'));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
