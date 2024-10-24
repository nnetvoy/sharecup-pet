import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true
  })


  const config = new DocumentBuilder()
    .setTitle('ShareCUP')
    .setDescription('Бекенд сервиса по капшерингу')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
