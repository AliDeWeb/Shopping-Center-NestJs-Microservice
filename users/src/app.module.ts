import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_POSTGRES_HOST'),
        port: +configService.get<string>('DB_POSTGRES_PORT')!,
        username: configService.get<string>('DB_POSTGRES_USER'),
        password: configService.get<string>('DB_POSTGRES_PASSWORD'),
        database: configService.get<string>('DB_POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),

    UsersModule,
  ],
})
@Global()
export class AppModule {}
