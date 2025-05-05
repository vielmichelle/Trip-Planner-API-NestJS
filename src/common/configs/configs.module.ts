import { Module } from '@nestjs/common';
import { ApiConfigsService } from './api-configs.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['development.env', 'test.env', 'production.env'],
            cache: true, // Cache configurations variables, for performance increase, as accessing process.env can be slow
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'test', 'production')
                    .default('development'),
                PORT: Joi.number().port().default(3000),

                APPLICATION_NAME: Joi.string(),
                APPLICATION_DESCRIPTION: Joi.string(),

                LOG_LEVELS: Joi.string(),

                DB_HOST: Joi.string(),
                DB_NAME: Joi.string(),

                TRIPS_SEARCH_RETRIEVE_API_HOST: Joi.string(),
                TRIPS_SEARCH_RETRIEVE_API_ROUTE: Joi.string(),
                TRIPS_SEARCH_RETRIEVE_API_KEY: Joi.string()
            }),
            validationOptions: {
                abortEarly: true, // If true, stops validation on the first error; if false, returns all errors. Defaults to false
                expandVariables: true, // Enable environment variable expansion
            },
        }),
    ],
    providers: [ApiConfigsService],
    exports: [ApiConfigsService]
})
export class ConfigsModule { }