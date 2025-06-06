import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get<ConfigService>(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: configService.get<string>('RABBITMQ_URLS')?.split(','),
        queue: 'users_queue',
        queueOptions: {
          durable: configService.get<string>('NODE_ENV') === 'production',
        },
      },
    },
  );

  await app.listen();
}

void bootstrap();
