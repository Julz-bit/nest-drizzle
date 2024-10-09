import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    exceptionFactory: (errors) => new BadRequestException(errors)
  }))
  app.useGlobalFilters(new ValidationExceptionFilter())
  const config = new DocumentBuilder()
    .setTitle('NEST DRIZZLE')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('NESTZZLE')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(+configService.get<number>('APP_PORT') || 3001);
}
bootstrap();
