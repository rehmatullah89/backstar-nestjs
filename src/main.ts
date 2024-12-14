import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  // config();
  const app = await NestFactory.create(AppModule, { cors: true });
  const options = new DocumentBuilder()
  .setTitle('SBR APP')
  .setDescription('Smile Brilliant APIs')
  .setVersion('1.0')
  .addServer('http://localhost:3000/', 'Local environment')
  .addServer('https://stable.smilebrilliant.com/api/', 'Staging')
  .addServer('https://smilebrilliant.com/api/', 'Production')
  .addTag('SBR')
  .build();
  // app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get('SBR_BACKEND_PREFIX'));
  console.log('Application is running on:', configService.get('PORT'));
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(configService.get('PORT') || 3002);
}
bootstrap();
