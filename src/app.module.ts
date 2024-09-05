import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            validationSchema: joi.object({
                APP_PORT: joi.number().default(4002)
            })
        }),
        HealthModule,
    ]
})
export class AppModule {}
