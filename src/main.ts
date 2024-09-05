import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
    });

    const config = new DocumentBuilder()
        .setTitle('Souls BE API Documentation')
        .setDescription('All Souls BE API endpoints documented below')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    const configService = app.get(ConfigService);
    const port = configService.get('APP_PORT');
    const logger = new Logger('bootstrap');
    await app.listen(port);

    logger.log(`listenning on ${port}`);
}

bootstrap();
