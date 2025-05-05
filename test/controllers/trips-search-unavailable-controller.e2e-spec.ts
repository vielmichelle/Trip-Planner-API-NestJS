import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { DatabaseService } from 'src/common/database/database.service';
import { generateBearerAuthenticationHeadersWithLogin } from './support/authentication';
import { setupEnvironmentVariables } from '../support/setup-environment-variables';

describe('Trips Search Service Unavailable (e2e)', () => {
    let app: INestApplication;
    let dbConnection: Connection;
    let httpServer: any;
    let tokenHeaders: any;

    // Since environment variables are cached to test this particular case, is necessary to recreate the application
    setupEnvironmentVariables();
    process.env.TRIPS_SEARCH_RETRIEVE_API_KEY = '';

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        dbConnection = app.get<DatabaseService>(DatabaseService).getConnection();
        httpServer = app.getHttpServer();

        tokenHeaders = await generateBearerAuthenticationHeadersWithLogin(httpServer);
    });

    afterAll(async () => {
        await app.close();
    });

    const tripsSearchRoute = '/trips/search';
    describe(`GET ${tripsSearchRoute}`, () => {
        describe('when bearer token header is provided', () => {
            describe('when some error occured during external service request', () => {
                it('should return 503 Service Unavailable', async () => {
                    let params = {
                        origin: "SYD",
                        destination: "GRU"
                    };
                    let response = await request(httpServer).get(generateUrlWithParams(tripsSearchRoute, params)).set(tokenHeaders);
                    expect(response.status).toBe(503);
                });
            });
        });
    });
});

// TODO: Generate dinamically
const generateUrlWithParams = (route: string, params: any) => {
    let url = new URL(route, 'http://example.com');
    if (params.origin) {
        url.searchParams.append("origin", params.origin);
    }

    if (params.destination) {
        url.searchParams.append("destination", params.destination);
    }

    if (params.sort_by) {
        url.searchParams.append("sort_by", params.sort_by);
    }

    if (params.limit) {
        url.searchParams.append("limit", params.limit);
    }

    return `${route}${url.search}`;
}