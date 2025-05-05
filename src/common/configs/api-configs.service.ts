import { Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './environment-variables';

@Injectable()
export class ApiConfigsService {
    constructor(private configService: ConfigService<EnvironmentVariables>) { }

    get nodeEnv(): string {
        return this.configService.get('NODE_ENV', { infer: true })!;
    }

    get port(): number {
        return this.configService.get('PORT', { infer: true })!;
    }

    get applicationName(): string {
        return this.configService.get('APPLICATION_NAME', { infer: true })!;
    }

    get applicationDescription(): string {
        return this.configService.get('APPLICATION_DESCRIPTION', { infer: true })!;
    }

    get logLevels(): LogLevel[] {
        var logLevelsString = this.configService.get('LOG_LEVELS', { infer: true })!;
        return logLevelsString.split(',') as LogLevel[];
    }

    get dbHost(): string {
        return this.configService.get('DB_HOST', { infer: true })!;
    }

    get dbName(): string {
        return this.configService.get('DB_NAME', { infer: true })!;
    }

    get tripsSearchRetrieveApiHost(): string {
        return this.configService.get('TRIPS_SEARCH_RETRIEVE_API_HOST', { infer: true })!;
    }

    get tripsSearchRetrieveApiRoute(): string {
        return this.configService.get('TRIPS_SEARCH_RETRIEVE_API_ROUTE', { infer: true })!;
    }

    get tripsSearchRetrieveApiKey(): string {
        return this.configService.get('TRIPS_SEARCH_RETRIEVE_API_KEY', { infer: true })!;
    }
}
