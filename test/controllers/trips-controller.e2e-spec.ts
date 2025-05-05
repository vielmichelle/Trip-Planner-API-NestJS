import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { DatabaseService } from 'src/common/database/database.service';
import { tripsOriginsSeedStub } from 'src/trips/test/stubs/trips-origins.stub';
import { plainToInstance } from 'class-transformer';
import { TripOriginResponseDto } from 'src/trips/common/dto/trip-origin-response.dto';
import { defaultSerializeOptions } from 'src/common/utils/serialize.utils';
import { generateBearerAuthenticationHeadersWithLogin } from './support/authentication';
import { TripDestinationResponseDto } from 'src/trips/common/dto/trip-destination-response.dto';
import { tripsDestinationsSeedStub } from 'src/trips/test/stubs/trips-destinations.stub';
import { setupEnvironmentVariables } from '../support/setup-environment-variables';
import { XCacheHeaderHitValue, XCacheHeaderKey, XCacheHeaderMissValue } from '../support/constants';

describe('Trips (e2e)', () => {
    let app: INestApplication;
    let dbConnection: Connection;
    let httpServer: any;
    let tokenHeaders: any;

    setupEnvironmentVariables();

    // Isolate trip origin/destinations database for avoiding data inconsistency
    // TODO: Manage Seeding with locks
    process.env.DB_NAME = `${process.env.DB_NAME}-trip-controller`;

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
        await dbConnection.dropDatabase();
        await app.close();
    });

    let tripsOriginsRoute = '/trips/origins';
    describe(`GET ${tripsOriginsRoute}`, () => {
        describe('when NO bearer token header is provided', () => {
            it('should return 401 Unauthorized', async () => {
                let response = await request(httpServer).get(tripsOriginsRoute);
                expect(response.status).toBe(401);
            });
        });

        describe('when bearer token header is provided', () => {
            let response: any;
            let expectedResult = tripsOriginsSeedStub();
            let expectedResultDto = plainToInstance(TripOriginResponseDto, expectedResult, defaultSerializeOptions);
            let expectedResultDtoSortedByCode = expectedResultDto.sort((a, b) => a.code.localeCompare(b.code));

            beforeAll(async () => {
                response = await request(httpServer).get(tripsOriginsRoute).set(tokenHeaders);
            });

            it('should return an array with 200 OK', async () => {
                expect(response.status).toBe(200);
                expect(Array.isArray([response.body])).toBe(true);
                expect(response.body.length).toEqual(expectedResult.length);
            });

            it('should return an array of trip origins serialized as dto', () => {
                expect(response.body).toEqual(expect.arrayContaining(expectedResultDto));
            })

            it('should return an array of trip origins ordered alphabetically by code', async () => {
                expect(response.body).toEqual(expectedResultDtoSortedByCode);
            });

            it('should return a cached response array of trip origins with intact dto serialization', async () => {
                let cachedResponse = await request(httpServer).get(tripsOriginsRoute).set(tokenHeaders);

                expect(response.header[XCacheHeaderKey]).toEqual(XCacheHeaderMissValue);
                expect(cachedResponse.header[XCacheHeaderKey]).toEqual(XCacheHeaderHitValue);
                expect(response.body).toEqual(cachedResponse.body);
            });
        });
    });

    let tripsDestinationsRoute = '/trips/destinations';
    describe(`GET ${tripsDestinationsRoute}`, () => {
        describe('when NO bearer token header is provided', () => {
            let response: any;
            beforeAll(async () => {
                response = await request(httpServer).get(tripsDestinationsRoute);
            })

            it('should return 401 Unauthorized', async () => {
                expect(response.status).toBe(401);
            });
        });

        describe('when bearer token header is provided', () => {
            let response: any;
            let expectedResult = tripsDestinationsSeedStub();
            let expectedResultDto = plainToInstance(TripDestinationResponseDto, expectedResult, defaultSerializeOptions);
            let expectedResultDtoSortedByCode = expectedResultDto.sort((a, b) => a.code.localeCompare(b.code));

            beforeAll(async () => {
                response = await request(httpServer).get(tripsDestinationsRoute).set(tokenHeaders);
            });

            it('should return an array with 200 OK', async () => {
                expect(response.status).toBe(200);
                expect(Array.isArray([response.body])).toBe(true);
                expect(response.body.length).toEqual(expectedResult.length);
            });

            it('should return an array of trip destinations serialized as dto', () => {
                expect(response.body).toEqual(expect.arrayContaining(expectedResultDto));
            })

            it('should return an array of trip destinations ordered alphabetically by code', async () => {
                expect(response.body).toEqual(expectedResultDtoSortedByCode);
            });

            it('should return a cached response array of trip destinations with intact dto serialization', async () => {
                let cachedResponse = await request(httpServer).get(tripsDestinationsRoute).set(tokenHeaders);

                expect(response.header[XCacheHeaderKey]).toEqual(XCacheHeaderMissValue);
                expect(cachedResponse.header[XCacheHeaderKey]).toEqual(XCacheHeaderHitValue);
                expect(response.body).toEqual(cachedResponse.body);
            });
        });
    });
});