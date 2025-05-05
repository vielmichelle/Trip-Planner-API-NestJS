import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { configureSwagger } from './common/swagger/swagger.configuration';
import { ApiConfigsService } from './common/configs/api-configs.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiConfigsService = app.get(ApiConfigsService);

  app.useLogger(new ConsoleLogger({
    prefix: apiConfigsService.applicationName,
    logLevels: apiConfigsService.logLevels
  }));

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Add default /api prefix for all routes
  app.setGlobalPrefix('api');

  // Enable versioning - Default v1 for all routes
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  // Configure global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // When set to true, this will automatically remove non-whitelisted properties
    transform: true // Transform automatically plain JavaScript payloads to be objects typed according to their DTO classes
  }));

  // Swagger configuration
  await configureSwagger(app, apiConfigsService);

  await app.listen(apiConfigsService.port ?? 3000);
}
bootstrap();
